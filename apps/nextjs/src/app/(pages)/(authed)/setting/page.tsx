import { Main } from "~shared/component";

import { api } from "~/trpc/server";
import { Internal } from "./internal";

export default async function Page() {
  const trpc = await api();
  const externalUsers = await trpc.auth.externalUsers();
  const session = await trpc.auth.session();
  if (!session) return;

  return (
    <Main>
      <h1 className="text-3xl font-bold">Setting</h1>
      <div className="rounded-lg bg-background p-2">
        <p>email: {session.user.email}</p>
        <p>name: {session.user.name}</p>
        <p>type: {session.user.type}</p>
        <p>role: {session.user.role}</p>
      </div>
      {session.user.type === "INTERNAL" && <Internal users={externalUsers} />}
    </Main>
  );
}
