import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { and, desc, eq } from "@squishmeist/db";
import { CreateJobSchema, job } from "@squishmeist/db/schema";

import { protectedProcedure } from "../../trpc";

export const jobRoute = {
  all: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.job.findMany({
      where: (fields, { isNull }) => isNull(fields.deletedAt),
      orderBy: desc(job.updatedAt),
    });
  }),

  byId: protectedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return await ctx.db.query.job.findFirst({
      where: (fields, { eq, isNull }) =>
        and(eq(fields.id, input), isNull(fields.deletedAt)),
    });
  }),

  create: protectedProcedure
    .input(CreateJobSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(job).values({
        ...input,
        createdBy: ctx.session.user.id,
        updatedBy: ctx.session.user.id,
      });
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(job)
        .set({
          deletedAt: new Date(),
          deletedBy: ctx.session.user.id,
        })
        .where(eq(job.id, input));
    }),

  assignGroup: protectedProcedure
    .input(z.object({ jobId: z.number(), groupId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(job)
        .set({
          group: input.groupId,
          assignedBy: ctx.session.user.id,
          updatedBy: ctx.session.user.id,
        })
        .where(eq(job.id, input.jobId));
    }),

  assignUser: protectedProcedure
    .input(z.object({ jobId: z.number(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(job)
        .set({
          group: null,
          assignedTo: input.userId,
          assignedBy: ctx.session.user.id,
          updatedBy: ctx.session.user.id,
        })
        .where(eq(job.id, input.jobId));
    }),
} satisfies TRPCRouterRecord;
