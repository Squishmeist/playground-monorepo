import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { eq } from "@squishmeist/db";
import { flag } from "@squishmeist/db/schema";

import { publicProcedure } from "../../trpc";

export const flagRouter = {
  updateFlag: publicProcedure
    .input(
      z.object({
        name: z.string(),
        enabled: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const _flag = await tx.query.flag.findFirst({
          where: (fields, { eq }) => eq(fields.name, input.name),
          columns: {
            id: true,
            name: true,
            enabled: true,
          },
        });
        if (!_flag)
          throw new Error(`Flag with name ${input.name} does not exist.`);

        const enabled = input.enabled ?? !_flag.enabled;
        await tx.update(flag).set({ enabled }).where(eq(flag.id, _flag.id));

        return {
          message: `Flag ${input.name} updated to ${enabled}`,
        };
      });
    }),
} satisfies TRPCRouterRecord;
