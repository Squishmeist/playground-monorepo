import { Suspense } from "react";
import { Internal } from "~setting/component";

import { Skeletons } from "@squishmeist/ui/molecule";

import { api } from "~/trpc/server";

export default async function Page() {
  const trpc = await api();
  const session = await trpc.auth.session();
  if (!session) return;

  return (
    <>
      <h1 className="text-3xl font-bold">Setting</h1>
      <div className="rounded-lg bg-background p-2">
        <p>email: {session.user.email}</p>
        <p>name: {session.user.name}</p>
        <p>type: {session.user.type}</p>
        <p>role: {session.user.role}</p>
      </div>

      <Suspense fallback={<Skeletons num={3} />}>
        {session.user.type === "INTERNAL" && <Test />}
      </Suspense>
    </>
  );
}

async function Test() {
  const trpc = await api();
  const externalUsers = await trpc.auth.externalUsers();

  return <Internal users={externalUsers} />;
}
