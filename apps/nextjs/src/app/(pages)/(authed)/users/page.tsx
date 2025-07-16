"use client";

import type { ColumnDef } from "@tanstack/react-table";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@squishmeist/ui/atom";
import { DataTable } from "@squishmeist/ui/organism";

export default function Page() {
  return (
    <>
      <div>
        <h1>Users</h1>
        <p className="text-gray-400">Manage your users here.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-semibold">User Management</CardTitle>
          <CardDescription>
            View and manage all users in the system
          </CardDescription>
          <CardContent className="pt-6">
            <Input className="!bg-background" placeholder="Search users..." />
            <Table />
          </CardContent>
        </CardHeader>
      </Card>
    </>
  );
}

type User = {
  id: string;
  name: string;
  role: string;
  organization: string;
  status: string;
  lastActive: string;
};

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "User",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "organization",
    header: "Organization",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "lastActive",
    header: "Last Active",
    cell: (info) => info.getValue(),
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

const data: User[] = [
  {
    id: "1",
    name: "Alice Smith",
    role: "Admin",
    organization: "Acme Corp",
    status: "Active",
    lastActive: "2025-07-15",
  },
  {
    id: "2",
    name: "Bob Johnson",
    role: "User",
    organization: "Beta Inc",
    status: "Inactive",
    lastActive: "2025-07-10",
  },
  {
    id: "3",
    name: "Carol Lee",
    role: "Manager",
    organization: "Gamma LLC",
    status: "Active",
    lastActive: "2025-07-16",
  },
];

function Table() {
  return <DataTable columns={columns} data={data} />;
}
