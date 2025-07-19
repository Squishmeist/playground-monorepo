import { protectedProcedure } from "../../../trpc";

export const all = protectedProcedure.query(async ({ ctx }) => {
  return await ctx.db.query.org.findMany({
    columns: {
      id: true,
      name: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
});
