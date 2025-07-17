"use client";

import { ColumnDef } from "@tanstack/react-table";

import { AppRouterOutputs } from "@squishmeist/api";
import { Button } from "@squishmeist/ui/atom";

type Org = AppRouterOutputs["org"]["all"][number];

export const columns: ColumnDef<Org>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        size="sm"
        variant="outline"
        onClick={() => alert(`Edit ${row.original.name}`)}
      >
        Edit
      </Button>
    ),
  },
];
