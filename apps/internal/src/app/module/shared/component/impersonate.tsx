"use client";

import { stopImpersonation } from "~auth/impersonate";

import type { AppRouterOutputs } from "@squishmeist/api";
import { Button } from "@squishmeist/ui/atom";

interface Props {
  session: AppRouterOutputs["auth"]["session"];
}

export function Impersonate({ session }: Props) {
  if (!session?.impersonatedBy) return;
  return (
    <Button
      className="max-h-6"
      variant="destructive"
      onClick={stopImpersonation}
    >
      Stop impersonation
    </Button>
  );
}
