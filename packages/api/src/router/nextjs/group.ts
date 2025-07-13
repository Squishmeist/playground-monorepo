import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { and, desc, eq } from "@squishmeist/db";
import {
  CreateGroupSchema,
  CreateGroupUserSchema,
  group,
  groupUser,
} from "@squishmeist/db/schema";

import { protectedProcedure } from "../../trpc";

export const groupRoute = {
  all: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.group.findMany({
      where: (fields, { isNull }) => isNull(fields.deletedAt),
      orderBy: desc(group.updatedAt),
    });
  }),

  byId: protectedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return await ctx.db.query.group.findFirst({
      where: (fields, { eq, isNull }) =>
        and(eq(fields.id, input), isNull(fields.deletedAt)),
    });
  }),

  create: protectedProcedure
    .input(CreateGroupSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(group).values({
        ...input,
        createdBy: ctx.session.user.id,
        updatedBy: ctx.session.user.id,
      });
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(group)
        .set({
          deletedAt: new Date(),
          deletedBy: ctx.session.user.id,
        })
        .where(eq(group.id, input));
    }),

  addUser: protectedProcedure
    .input(CreateGroupUserSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(groupUser).values({
        ...input,
        createdBy: ctx.session.user.id,
        updatedBy: ctx.session.user.id,
      });
    }),

  removeUser: protectedProcedure
    .input(CreateGroupUserSchema.omit({ role: true }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(groupUser)
        .where(
          and(
            eq(groupUser.userId, input.userId),
            eq(groupUser.groupId, input.groupId),
          ),
        );
    }),
} satisfies TRPCRouterRecord;
