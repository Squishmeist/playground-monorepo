import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@squishmeist/ui/atom";
import { DataTable } from "@squishmeist/ui/organism";

import { api } from "~/trpc/server";
import { columns } from "./table";

export default function Page() {
  return (
    <>
      <div>
        <h1>Orgs</h1>
        <p className="text-gray-400">Manage your organisations here.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-semibold">
            Organisation Management
          </CardTitle>
          <CardDescription>
            View and manage all organisations in the system
          </CardDescription>
          <CardContent className="pt-6">
            <Input
              className="!bg-background"
              placeholder="Search organisations..."
            />
            <Table />
          </CardContent>
        </CardHeader>
      </Card>
    </>
  );
}

async function Table() {
  const trpc = await api();
  const orgs = await trpc.org.all();

  return <DataTable columns={columns} data={orgs} />;
}
