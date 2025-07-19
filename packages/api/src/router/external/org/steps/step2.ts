import { TRPCError } from "@trpc/server";

import { eq } from "@squishmeist/db";
import {
  org,
  orgAddress,
  orgContractorSignup,
  OrgContractorStep2Schema,
} from "@squishmeist/db/schema";

import { protectedProcedure } from "../../../../trpc";

const orgNotFound = (desc?: string) =>
  new TRPCError({
    code: "BAD_REQUEST",
    message: `Organisation ${desc} not found`,
  });
const orgNotInProgress = new TRPCError({
  code: "BAD_REQUEST",
  message: "Organisation is not in progress",
});

export const getContractorStep2 = protectedProcedure.query(async ({ ctx }) => {
  return await ctx.db.transaction(async (tx) => {
    const response = await tx
      .select({
        id: org.id,
        status: org.status,
        step: orgContractorSignup.step,
      })
      .from(org)
      .innerJoin(orgContractorSignup, eq(org.id, orgContractorSignup.orgId))
      .where(eq(org.applicantId, ctx.session.user.id));

    const _org = response[0];
    if (!_org) throw orgNotFound();
    if (_org.status !== "IN_PROGRESS") throw orgNotInProgress;
    if (_org.step < 2)
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Cannot skip to step 2 for organisation.`,
      });

    return await tx.query.orgAddress.findFirst({
      where: (orgAddress, { eq }) => eq(orgAddress.orgId, _org.id),
      columns: {
        street: true,
        city: true,
        county: true,
        postcode: true,
      },
    });
  });
});

export const contractorStep2 = protectedProcedure
  .input(OrgContractorStep2Schema)
  .mutation(async ({ ctx, input }) => {
    return await ctx.db.transaction(async (tx) => {
      const response = await tx
        .select({
          id: org.id,
          status: org.status,
          step: orgContractorSignup.step,
        })
        .from(org)
        .innerJoin(orgContractorSignup, eq(org.id, orgContractorSignup.orgId))
        .where(eq(org.applicantId, ctx.session.user.id));
      const _org = response[0];
      if (!_org) throw orgNotFound();
      if (_org.status !== "IN_PROGRESS") throw orgNotInProgress;
      if (_org.step < 2)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Cannot skip to step 2 for organisation.`,
        });

      await tx
        .insert(orgAddress)
        .values({
          orgId: _org.id,
          ...input,
          createdBy: ctx.session.user.id,
          updatedBy: ctx.session.user.id,
        })
        .onConflictDoUpdate({
          target: orgAddress.orgId,
          set: {
            ...input,
            updatedBy: ctx.session.user.id,
          },
        });
      await tx
        .update(orgContractorSignup)
        .set({
          step: _org.step < 3 ? 3 : _org.step,
          updatedBy: ctx.session.user.id,
        })
        .where(eq(orgContractorSignup.orgId, _org.id));
      return {
        code: "SUCCESS",
        message: `Step 2 for organisation.`,
      };
    });
  });
