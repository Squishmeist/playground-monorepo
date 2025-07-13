import Link from "next/link";
import { Flow } from "~auth/component";
import { getSession } from "~auth/server";
import { Action } from "~dashboard/component";
import { Main } from "~shared/component";

import { jobFlag, settingFlag } from "~/app/module/flag";

export default async function Page() {
  const session = await getSession();

  if (!session) return <Unauthed />;
  return <Authed />;
}

function Unauthed() {
  return (
    <main className="flex h-screen w-full flex-col items-center gap-2 pt-20">
      <h1>Auth</h1>
      <Flow />
    </main>
  );
}

async function Authed() {
  const links = [
    {
      href: "/job",
      label: "Job",
      flag: jobFlag,
    },
    {
      href: "/setting",
      label: "Setting",
      flag: settingFlag,
    },
  ];

  return (
    <Main>
      <Action />
      <div className="flex flex-col gap-4">
        <h2>Flag Modules</h2>
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
    </Main>
  );
}
