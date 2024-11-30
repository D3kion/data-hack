from minio import Minio
from clickhouse_driver import Client
from config import Config

# MinIO клиент
def get_minio_client():
    return Minio(
        Config.MINIO_URL,
        access_key=Config.MINIO_ACCESS_KEY,
        secret_key=Config.MINIO_SECRET_KEY,
        secure=False
    )

# ClickHouse клиент
def get_clickhouse_client():
    return Client(
        host=Config.CLICKHOUSE_HOST,
        port=Config.CLICKHOUSE_PORT,
        user=Config.CLICKHOUSE_USER,
        password=Config.CLICKHOUSE_PASSWORD,
        database=Config.CLICKHOUSE_DB
    )

# Загрузка файла в MinIO
def upload_file_to_minio(file_name: str, file_data: bytes):
    minio_client = get_minio_client()
    minio_client.put_object("my-bucket", file_name, file_data, len(file_data))

# Запрос для ClickHouse
def insert_data_to_clickhouse():
    client = get_clickhouse_client()
    query = """
    INSERT INTO trips
    SELECT *
    FROM s3('https://datasets-documentation.s3.eu-west-3.amazonaws.com/nyc-taxi/trips_*.gz', 'TabSeparatedWithNames')
    LIMIT 1000000;
    """
    client.execute(query)

# Магия с данными, создание метрик
def process_data_and_generate_metrics():
    client = get_clickhouse_client()
    query = """
    INSERT INTO metrics
    SELECT AVG(fare_amount), COUNT(*) 
    FROM trips 
    GROUP BY passenger_count;
    """
    client.execute(query)
