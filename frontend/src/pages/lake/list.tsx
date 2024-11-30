import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import {
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
} from "@/shared/ui-kit";
import { DataTable } from "@/shared/data-table";
import { LakeImportDialog } from "@/features/lake-import";

interface DataLakeEntry {
  id: string;
  name: string;
  size?: number;
  type: string;
  status: string;
  uploadedAt: string;
}

const data: DataLakeEntry[] = [
  {
    id: "m5gr84i9",
    name: "File entry #1",
    size: 316,
    type: "csv",
    status: "success",
    uploadedAt: new Date().toJSON(),
  },
  {
    id: "3u1reuv4",
    name: "File entry #2",
    size: 242,
    type: "csv",
    status: "success",
    uploadedAt: new Date().toJSON(),
  },
  {
    id: "derv1ws0",
    name: "File entry #3",
    size: 837,
    type: "csv",
    status: "processing",
    uploadedAt: new Date().toJSON(),
  },
  {
    id: "5kma53ae",
    name: "File entry #4",
    size: 874,
    type: "csv",
    status: "success",
    uploadedAt: new Date().toJSON(),
  },
  {
    id: "bhqecj4p",
    name: "File entry #5",
    size: 721,
    type: "csv",
    status: "failed",
    uploadedAt: new Date().toJSON(),
  },
];

const columns: ColumnDef<DataLakeEntry>[] = [
  {
    id: "select",
    maxSize: 40,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    // enableSorting: false,
    // enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Название",
    size: 480,
    cell: (props) => (
      <div className="text-nowrap">{props.getValue() as string}</div>
    ),
  },
  {
    accessorKey: "type",
    header: "Тип",
    maxSize: 120,
  },
  {
    accessorKey: "size",
    header: "Размер",
    maxSize: 120,
  },
  {
    accessorKey: "status",
    header: "Статус",
    maxSize: 120,
    cell: (props) => (
      <div className="capitalize">{props.getValue() as string}</div>
    ),
  },
  {
    accessorKey: "uploadedAt",
    header: "Загружен",
    maxSize: 120,
    cell: (props) => (
      <div className="text-nowrap">
        {new Date(props.getValue() as string).toLocaleString()}
      </div>
    ),
  },
  {
    id: "actions",
    maxSize: 80,
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 float-right"
              // onClick={(e) => e.preventDefault()}
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>Просмотр</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>Скачать</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" disabled>
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function LakeListPage() {
  return (
    <div className="container space-y-6">
      <div className="flex items-end justify-between">
        <h2 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
          Lake
        </h2>
        <LakeImportDialog />
      </div>
      <div className="flex justify-between flex-wrap gap-4">
        <Input placeholder="Поиск" className="md:max-w-xs" />
        <div className="flex gap-2">
          <Button variant="secondary" disabled>
            Скачать
          </Button>
          <Button variant="destructive" disabled>
            Удалить
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={data} onRowClick={console.log} />
    </div>
  );
}
