import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure, publicProcedure } from "../../trpc";

export const authRouter = {
  session: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  externalUsers: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.user.findMany({
      where: (user, { eq }) => eq(user.type, "EXTERNAL"),
      columns: {
        id: true,
        name: true,
        type: true,
        role: true,
      },
    });
  }),
} satisfies TRPCRouterRecord;
