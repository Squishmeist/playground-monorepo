import Link from "next/link";
import { SignIn, SignOut, SignUp } from "~auth/component";
import { getSession } from "~auth/server";

import { accountFlag, jobFlag } from "~/app/module/flag";
import { Test } from "./test";
import { Toggle } from "./toggle";

export default async function Page() {
  const session = await getSession();

  const links = [
    {
      href: "/job",
      label: "Job",
      flag: jobFlag,
    },
    {
      href: "/account",
      label: "Account",
      flag: accountFlag,
    },
  ];

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center p-20">
      <div className="flex h-full w-full max-w-7xl flex-col gap-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {session ? (
          <SignOut name={session.user.name} />
        ) : (
          <div className="flex flex-col gap-4">
            <SignIn />
            <SignUp />
          </div>
        )}
        <Test />
        <Toggle />
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Modules</h2>
          <div>
            {await Promise.all(
              links.map(async (link) => {
                const isEnabled = await link.flag();
                return (
                  isEnabled && (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="mb-4 block text-blue-500 hover:underline"
                    >
                      {link.label}
                    </Link>
                  )
                );
              }),
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
