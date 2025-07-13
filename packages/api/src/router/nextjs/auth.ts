import type { TRPCRouterRecord } from "@trpc/server";

import { eq } from "@squishmeist/db";
import { user } from "@squishmeist/db/schema";

import { protectedProcedure, publicProcedure } from "../../trpc";

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  externalUsers: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.user.findMany({
      where: eq(user.type, "EXTERNAL"),
      columns: {
        id: true,
        name: true,
        type: true,
        role: true,
      },
    });
  }),
} satisfies TRPCRouterRecord;
