import type { TRPCRouterRecord } from "@trpc/server";
import { trace } from "@opentelemetry/api";
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
      const tracer = trace.getTracer("flag-tracer");
      const span = tracer.startSpan("update-flag");

      span.setAttributes({
        "database-transcation": "flag-update",
      });
      return await ctx.db.transaction(async (tx) => {
        const _flag = await tx.query.flag.findFirst({
          where: (fields, { eq }) => eq(fields.name, input.name),
          columns: {
            id: true,
            name: true,
            enabled: true,
          },
        });

        if (!_flag) {
          span.end();
          throw new Error(`Flag with name ${input.name} does not exist.`);
        }

        const enabled = input.enabled ?? !_flag.enabled;

        span.setAttributes({
          enabled,
        });

        await tx.update(flag).set({ enabled }).where(eq(flag.id, _flag.id));

        span.end();

        return {
          message: `Flag ${input.name} updated to ${enabled}`,
        };
      });
    }),
} satisfies TRPCRouterRecord;
