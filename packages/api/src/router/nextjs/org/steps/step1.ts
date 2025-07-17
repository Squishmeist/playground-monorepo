import { TRPCError } from "@trpc/server";

import {
  org,
  orgContractorSignup,
  OrgContractorStep1Schema,
} from "@squishmeist/db/schema";

import { protectedProcedure } from "../../../../trpc";

const orgNotFound = (desc?: string) =>
  new TRPCError({
    code: "BAD_REQUEST",
    message: `Organisation ${desc} not found`,
  });

export const getContractorStep1 = protectedProcedure.query(async ({ ctx }) => {
  return await ctx.db.query.org.findFirst({
    where: (org, { eq }) => eq(org.applicantId, ctx.session.user.id),
    columns: { name: true },
  });
});

export const contractorStep1 = protectedProcedure
  .input(OrgContractorStep1Schema)
  .mutation(async ({ ctx, input }) => {
    return await ctx.db.transaction(async (tx) => {
      const _org = await tx
        .insert(org)
        .values({
          ...input,
          applicantId: ctx.session.user.id,
          createdBy: ctx.session.user.id,
          updatedBy: ctx.session.user.id,
        })
        .returning({ id: org.id })
        .onConflictDoUpdate({
          target: org.applicantId,
          set: {
            ...input,
            updatedBy: ctx.session.user.id,
          },
        });
      const orgId = _org[0]?.id;
      if (!orgId) throw orgNotFound();
      await tx
        .insert(orgContractorSignup)
        .values({
          orgId,
          step: 2,
          createdBy: ctx.session.user.id,
          updatedBy: ctx.session.user.id,
        })
        .onConflictDoNothing();
      return {
        code: "SUCCESS",
        message: `Step 1 for organisation.`,
      };
    });
  });
