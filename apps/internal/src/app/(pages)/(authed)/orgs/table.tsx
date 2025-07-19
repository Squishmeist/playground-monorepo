"use client";

import { ColumnDef } from "@tanstack/react-table";

import { AppRouterOutputs } from "@squishmeist/api";

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
    cell: ({ row }) => {
      return formatTime(row.original.createdAt);
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      return formatTime(row.original.updatedAt);
    },
  },
];

function formatTime(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes} on ${day}/${month}/${year}`;
}
