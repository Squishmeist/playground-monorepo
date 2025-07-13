"use client";

import { stopImpersonation } from "~auth/impersonate";

import type { AppRouterOutputs } from "@squishmeist/api";
import { Button } from "@squishmeist/ui/atom";

interface Props {
  session: NonNullable<AppRouterOutputs["auth"]["session"]>;
}

export function Impersonate({ session }: Props) {
  if (!session.impersonatedBy) return;

  return (
    <div className="flex items-center justify-between bg-red-400 px-2 py-1">
      <p>{`IMPERSONATING USER: ${session.user.name}`}</p>
      <Button variant="secondary" onClick={stopImpersonation}>
        Stop
      </Button>
    </div>
  );
}
