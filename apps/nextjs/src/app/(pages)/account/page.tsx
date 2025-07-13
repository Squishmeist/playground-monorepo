import Link from "next/link";

import { getSession } from "~/app/module/auth/server";
import { api, trpc } from "~/trpc/server";
import { users } from "./data";
import { Internal } from "./internal";

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function Page({ searchParams }: Props) {
  const session = await getSession();
  const trpc = await api();
  const externalUsers = await trpc.auth.externalUsers();
  if (!session) return;

  const impersonateId = (await searchParams).impersonate;

  return (
    <div>
      {/* {!impersonateUser && user.type === "INTERNAL" && (
        <div className="bg-blue-400 px-2 py-1">{`INTERNAL USER: ${user.name}`}</div>
      )}
      {impersonateUser && (
        <div className="bg-blue-400 px-2 py-1">{`IMPERSONATING USER: ${impersonateUser.name}`}</div>
      )} */}
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
