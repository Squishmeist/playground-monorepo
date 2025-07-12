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
    const totalPosts = await ctx.db.query.Post.findMany();
    return {
      totalPosts: totalPosts.length,
      // Add more analytics as needed
    };
  }),
} satisfies TRPCRouterRecord;
