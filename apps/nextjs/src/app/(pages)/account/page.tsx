import Link from "next/link";

import { api } from "~/trpc/server";
import { Impersonate } from "./impersonate";
import { Internal } from "./internal";

export default async function Page() {
  const trpc = await api();
  const externalUsers = await trpc.auth.externalUsers();
  const session = await trpc.auth.session();

  if (!session) return;
  console.log("session", session);

  function internal() {
    if (session?.user.type === "INTERNAL") return session.user;
    if (session?.impersonatedBy) return session.impersonatedBy;
  }
  const internalUser = internal();

  return (
    <div>
      {internalUser && (
        <div className="bg-blue-400 px-2 py-1">{`INTERNAL USER: ${internalUser.name}`}</div>
      )}
      <Impersonate session={session} />
      <main className="flex h-screen w-screen flex-col items-center justify-center p-20">
        <div className="flex h-full w-full max-w-7xl flex-col gap-6">
          <h1 className="mb-8 text-3xl font-bold">Account</h1>
          <Link href="/" className="text-blue-500 hover:underline">
            Go to Home Page
          </Link>
          <p>{JSON.stringify(session.user)}</p>
          {session.user.type === "INTERNAL" && (
            <Internal users={externalUsers} />
          )}
        </div>
      </main>
    </div>
  );
}
