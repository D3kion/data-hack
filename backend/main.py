from fastapi import FastAPI, File, UploadFile
from typing import List
from pydantic import BaseModel
from utils import upload_file_to_minio, insert_data_to_clickhouse, process_data_and_generate_metrics

app = FastAPI()

class SignUpModel(BaseModel):
    username: str
    password: str

class SignInModel(BaseModel):
    username: str
    password: str

@app.post("/signup")
async def signup(user: SignUpModel):
    # Логика для регистрации пользователя
    return {"message": "User registered successfully"}

@app.post("/signin")
async def signin(user: SignInModel):
    # Логика для входа пользователя
    return {"message": "User signed in successfully"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_data = await file.read()
    file_name = file.filename
    upload_file_to_minio(file_name, file_data)
    insert_data_to_clickhouse()
    process_data_and_generate_metrics()
    return {"message": "File uploaded and processed"}

@app.get("/download/{file_name}")
async def download_file(file_name: str):
    minio_client = get_minio_client()
    data = minio_client.get_object("my-bucket", file_name)
    return {"file": data.read()}

@app.get("/list")
async def list_files():
    minio_client = get_minio_client()
    files = minio_client.list_objects("my-bucket")
    return {"files": [file.object_name for file in files]}

@app.delete("/remove/{file_name}")
async def remove_file(file_name: str):
    minio_client = get_minio_client()
    minio_client.remove_object("my-bucket", file_name)
    return {"message": f"File {file_name} removed successfully"}
