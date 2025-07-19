"use client";

import { stopImpersonation } from "~auth/impersonate";

import type { ExternalRouterOutputs } from "@squishmeist/api";
import { Button } from "@squishmeist/ui/atom";

interface Props {
  session: ExternalRouterOutputs["auth"]["session"];
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
