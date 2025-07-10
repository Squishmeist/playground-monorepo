import Link from "next/link";

import { accountFlag, jobFlag } from "~/module/flags";

export default async function Page() {
  const links = [
    {
      href: "/job",
      label: "Job Page",
      flag: jobFlag,
    },
    {
      href: "/account",
      label: "Account Page",
      flag: accountFlag,
    },
  ];

  return (
    <main className="container h-screen py-16">
      <h1 className="mb-8 text-3xl font-bold">Home</h1>
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
    </main>
  );
}
