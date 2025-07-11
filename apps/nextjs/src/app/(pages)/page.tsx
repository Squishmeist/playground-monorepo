import Link from "next/link";

import { accountFlag, jobFlag } from "~/module/flag";
import { Toggle } from "./toggle";

export default async function Page() {
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
        <Toggle />

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
    </main>
  );
}
