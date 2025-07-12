import Link from "next/link";

import { getSession } from "~/app/module/auth/server";
import { users } from "./data";
import { Internal } from "./internal";

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function Page({ searchParams }: Props) {
  const session = await getSession();
  if (!session) return;

  const impersonateId = (await searchParams).impersonate;

  function canImpersonate(type: string) {
    return type === "INTERNAL";
  }
  function findExternalUser(userId: string) {
    return users.find((u) => u.id === userId && u.type === "EXTERNAL");
  }

  const user = session.user;
  const impersonateUser =
    canImpersonate(user.type) && impersonateId
      ? findExternalUser(impersonateId)
      : undefined;

  return (
    <div>
      {!impersonateUser && user.type === "INTERNAL" && (
        <div className="bg-blue-400 px-2 py-1">{`INTERNAL USER: ${user.name}`}</div>
      )}
      {impersonateUser && (
        <div className="bg-blue-400 px-2 py-1">{`IMPERSONATING USER: ${impersonateUser.name}`}</div>
      )}
      <main className="flex h-screen w-screen flex-col items-center justify-center p-20">
        <div className="flex h-full w-full max-w-7xl flex-col gap-6">
          <h1 className="mb-8 text-3xl font-bold">Account</h1>
          <Link href="/" className="text-blue-500 hover:underline">
            Go to Home Page
          </Link>
          <p>{JSON.stringify(user)}</p>
          {!impersonateUser && user.type === "INTERNAL" && <Internal />}
        </div>
      </main>
    </div>
  );
}
