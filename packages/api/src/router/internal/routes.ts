import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure } from "../../trpc";

export const info = {
  // User management
  getUser: protectedProcedure.query(({ ctx }) => {
    // This would typically query users table
    // For now, just return session info as placeholder
    return ctx.session;
  }),

  // Analytics and statistics
  getAnalytics: protectedProcedure.query(async ({ ctx }) => {
    const totalGroups = await ctx.db.query.group.findMany();
    const totalUsers = await ctx.db.query.user.findMany();
    return {
      totalGroups: totalGroups.length,
      totalUsers: totalUsers.length,
    };
  }),
} satisfies TRPCRouterRecord;
