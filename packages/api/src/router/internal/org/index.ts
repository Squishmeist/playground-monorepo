import type { TRPCRouterRecord } from "@trpc/server";

import { all } from "./all";
import { id } from "./id";

export const orgRoute = {
  all,
  id,
} satisfies TRPCRouterRecord;
