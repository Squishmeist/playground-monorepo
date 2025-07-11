import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { eq } from "@squishmeist/db";
import { flag } from "@squishmeist/db/schema";

import { publicProcedure } from "../../trpc";

export const testRouter = {
  error: publicProcedure
    .input(
      z.object({
        error: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      if (input.error) throw new Error(`Error requested by client.`);
      return {
        message: "No error requested",
      };
    }),
} satisfies TRPCRouterRecord;
