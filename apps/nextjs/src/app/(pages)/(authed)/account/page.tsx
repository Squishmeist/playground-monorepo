import { Nav } from "~shared/component/nav";

import { api } from "~/trpc/server";
import { Internal } from "./internal";

export default async function Page() {
  const trpc = await api();
  const externalUsers = await trpc.auth.externalUsers();
  const session = await trpc.auth.session();
  if (!session) return;

  return (
    <main className="flex flex-col items-center justify-center gap-6">
      <Nav />
      <div className="flex h-full w-full max-w-7xl flex-col gap-6">
        <h1 className="mb-8 text-3xl font-bold">Account</h1>
        <p className="break-words bg-blue-400">
          {JSON.stringify(session.user)}
        </p>
        {session.user.type === "INTERNAL" && <Internal users={externalUsers} />}
      </div>
    </main>
  );
}
