import Link from "next/link";
import { SignIn, SignUp } from "~auth/component";
import { getSession } from "~auth/server";
import { Action } from "~dashboard/component";
import { Nav } from "~shared/component";

import { accountFlag, jobFlag } from "~/app/module/flag";

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
    <main className="flex flex-col items-center justify-center">
      <Nav />
      <div className="flex h-full w-full max-w-7xl flex-col gap-6">
        {!session && (
          <div className="flex flex-col gap-4">
            <SignIn />
            <SignUp />
          </div>
        )}
        <Action />
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Flag Modules</h2>
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
