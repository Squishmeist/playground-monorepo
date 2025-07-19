import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { publicProcedure } from "../../trpc";

export const testRoute = {
  error: publicProcedure
    .input(
      z.object({
        error: z.boolean(),
      }),
    )
    .mutation(({ input }) => {
      if (input.error) throw new Error(`Error requested by client.`);
      return {
        message: "No error requested",
      };
    }),
} satisfies TRPCRouterRecord;
