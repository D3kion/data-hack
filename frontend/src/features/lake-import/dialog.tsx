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
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui-kit";

export function LakeImportDialog() {
  const [type, setType] = useState<string | null>(null);
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
        <div className="min-h-[320px] space-y-2">
          <div className="space-y-1.5">
            <Label htmlFor="dataType">Тип данных</Label>
            <Select onValueChange={(type) => setType(type)}>
              <SelectTrigger id="dataType">
                <SelectValue placeholder="Выберите тип данных" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Файловые</SelectLabel>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json" disabled>
                    JSON
                  </SelectItem>
                  <SelectItem value="xml" disabled>
                    XML
                  </SelectItem>
                  <SelectItem value="xlsx" disabled>
                    Excel
                  </SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Реляционные</SelectLabel>
                  <SelectItem value="postgres" disabled>
                    PostgreSQL
                  </SelectItem>
                  <SelectItem value="..." disabled>
                    ...
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {type === "csv" && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="importType">Метод импорта</Label>
                <Select value="manual">
                  <SelectTrigger id="importType">
                    <SelectValue placeholder="Выберите метод импорта" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Ручная загрузка</SelectItem>
                    <SelectItem value="external" disabled>
                      Из внешнего источника
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dropzone onDrop={(files) => setFiles(files)}>
                {({ getRootProps, getInputProps }) => (
                  <div
                    className="grid w-full max-w-sm items-center gap-1.5 cursor-pointer"
                    {...getRootProps()}
                  >
                    <Input type="file" {...getInputProps()} />
                    {!files.length && (
                      <div className="px-4 py-12 font-medium leading-tight max-w-xs mx-auto text-center flex flex-col gap-4">
                        Выберите файлы для загрузки или перетищаите их в это
                        окно
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
            </>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" disabled={!type || !files.length}>
              Загрузить
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
