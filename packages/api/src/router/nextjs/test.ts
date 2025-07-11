import type { TRPCRouterRecord } from "@trpc/server";
import { trace } from "@opentelemetry/api";
import { z } from "zod/v4";

import { publicProcedure } from "../../trpc";

export const testRouter = {
  error: publicProcedure
    .input(
      z.object({
        error: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      const tracer = trace.getTracer("custom-tracer");
      const span = tracer.startSpan("operation-name");

      span.setAttributes({
        "custom.attribute": "value",
      });

      if (input.error) throw new Error(`Error requested by client.`);

      span.end();
      return {
        message: "No error requested",
      };
    }),
} satisfies TRPCRouterRecord;
