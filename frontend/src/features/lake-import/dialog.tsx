import { useState } from "react";
import Dropzone from "react-dropzone";
import { UploadCloudIcon } from "lucide-react";

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from "@/shared/ui-kit";

export function LakeImportDialog() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setFiles([]);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <UploadCloudIcon />
          Импорт
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Импорт</DialogTitle>
          <DialogDescription>
            Настройки импорта в озеро данных
          </DialogDescription>
        </DialogHeader>
        <Dropzone onDrop={(files) => setFiles(files)}>
          {({ getRootProps, getInputProps }) => (
            <div
              className="grid w-full max-w-sm items-center gap-1.5 cursor-pointer"
              {...getRootProps()}
            >
              <Input type="file" {...getInputProps()} />
              {!files.length && (
                <div className="px-4 py-12 font-medium leading-tight max-w-xs mx-auto text-center flex flex-col gap-4">
                  Выберите файлы для загрузки или перетищаите их в это окно
                  <Button className="w-fit mx-auto" variant="secondary">
                    Выбрать
                  </Button>
                </div>
              )}
              {!!files.length && (
                <div>
                  <p className="font-medium text-lg">Selected files:</p>
                  <ul>
                    {files.map((f) => (
                      <li key={f.name}>{f.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Dropzone>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">Загрузить</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
