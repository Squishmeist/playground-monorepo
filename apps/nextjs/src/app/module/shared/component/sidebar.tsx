"use client";

import { useRouter } from "next/navigation";
import { authClient } from "~auth/client";

import { Button } from "@squishmeist/ui/atom";

import { Nav } from "./nav";

export function Sidebar() {
  const { signOut } = authClient;
  const router = useRouter();

  async function handleSignout() {
    await signOut();
    router.refresh();
  }

  return (
    <aside className="flex h-full min-w-64 flex-col justify-between gap-6 border-r border-gray-600 bg-background p-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Nav />
      </div>
      <div>
        <Button className="w-full" onClick={handleSignout}>
          Signout
        </Button>
      </div>
    </aside>
  );
}
