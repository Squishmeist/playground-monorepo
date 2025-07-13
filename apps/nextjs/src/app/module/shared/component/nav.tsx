"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "~auth/client";

import { Button } from "@squishmeist/ui/atom";

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = authClient;

  const items = [
    { href: "/", label: "Dashboard", flag: true },
    { href: "/account", label: "Account", flag: true },
    { href: "/job", label: "Job", flag: false },
  ];

  async function handleSignout() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="w-full max-w-5xl">
      <nav className="flex w-full justify-between gap-4 rounded-lg bg-white/10 px-8 py-4">
        <div className="flex items-center gap-4">
          {items.map((item) => {
            const isCurrent = pathname === item.href;
            const isEnabled = isCurrent ? false : item.flag;
            return (
              <Link
                key={item.href}
                href={isEnabled ? item.href : "#"}
                className={`${
                  isCurrent
                    ? "font-bold text-blue-400 hover:cursor-default"
                    : isEnabled
                      ? "text-white hover:text-white/40"
                      : "text-white/30 hover:cursor-not-allowed"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <Button onClick={handleSignout}>Signout</Button>
      </nav>
    </div>
  );
}
