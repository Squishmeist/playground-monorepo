"use client";

import { useRouter } from "next/navigation";
import { authClient } from "~auth/client";

import { Button } from "@squishmeist/ui/atom";

export function SignOut() {
  const { signOut } = authClient;
  const router = useRouter();

  async function handleSignout() {
    await signOut();
    router.refresh();
  }

  return (
    <Button className="w-full" onClick={handleSignout}>
      Signout
    </Button>
  );
}
