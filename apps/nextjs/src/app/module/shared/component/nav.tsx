"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  items: { href: string; label: string; flag: boolean }[];
}

export function Nav({ items }: Props) {
  const pathname = usePathname();

  return (
    <nav className="flex w-full flex-col gap-2">
      {items.map((item) => {
        const isCurrent = pathname === item.href;
        const isEnabled = isCurrent ? false : item.flag;
        return (
          <Link
            key={item.href}
            href={isEnabled ? item.href : "#"}
            className={`w-full rounded-md px-2 py-1 ${
              isCurrent
                ? "pointer-events-none font-semibold text-primary"
                : isEnabled
                  ? "text-black hover:bg-primary/20 hover:text-black/40 dark:text-white dark:hover:text-white/40"
                  : "text-black/30 hover:cursor-not-allowed dark:text-white/30"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
