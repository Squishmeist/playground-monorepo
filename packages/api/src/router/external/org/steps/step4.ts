import { TRPCError } from "@trpc/server";

import { eq } from "@squishmeist/db";
import {
  org,
  orgContractor,
  orgContractorSignup,
  OrgContractorStep3Schema,
  OrgContractorStep4Schema,
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

export const getContractorStep4 = protectedProcedure.query(async ({ ctx }) => {
  return await ctx.db.transaction(async (tx) => {
    const response = await tx
      .select({
        id: org.id,
        status: org.status,
        step: orgContractorSignup.step,
        step4Data: orgContractorSignup.step4Data,
      })
      .from(org)
      .innerJoin(orgContractorSignup, eq(org.id, orgContractorSignup.orgId))
      .where(eq(org.applicantId, ctx.session.user.id));

    const _org = response[0];
    if (!_org) throw orgNotFound();
    if (_org.status !== "IN_PROGRESS") throw orgNotInProgress;
    if (_org.step < 4)
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Cannot skip to step 4 for organisation.`,
      });

    if (!_org.step4Data) return undefined;
    const parse = OrgContractorStep4Schema.safeParse(
      JSON.parse(_org.step4Data),
    );
    if (!parse.success)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Step 4 data is invalid",
      });

    return parse.data;
  });
});

export const contractorStep4 = protectedProcedure
  .input(OrgContractorStep4Schema)
  .mutation(async ({ ctx, input }) => {
    return await ctx.db.transaction(async (tx) => {
      const response = await tx
        .select({
          id: org.id,
          status: org.status,
          step: orgContractorSignup.step,
          step3Data: orgContractorSignup.step3Data,
        })
        .from(org)
        .innerJoin(orgContractorSignup, eq(org.id, orgContractorSignup.orgId))
        .where(eq(org.applicantId, ctx.session.user.id));
      const _org = response[0];
      if (!_org) throw orgNotFound();
      if (_org.status !== "IN_PROGRESS") throw orgNotInProgress;
      if (_org.step < 4)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Cannot skip to step 4 for organisation.`,
        });

      await tx
        .update(orgContractorSignup)
        .set({
          step4Data: JSON.stringify(input),
          updatedBy: ctx.session.user.id,
        })
        .where(eq(orgContractorSignup.orgId, _org.id));

      if (!_org.step3Data) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Step 3 data is required before submitting step 4",
        });
      }
      const parse = OrgContractorStep3Schema.safeParse(
        JSON.parse(_org.step3Data),
      );
      if (!parse.success)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Step 3 data is invalid",
        });

      await tx.insert(orgContractor).values({
        ...parse.data,
        ...input,
        orgId: _org.id,
        createdBy: ctx.session.user.id,
        updatedBy: ctx.session.user.id,
      });
      await tx
        .update(org)
        .set({
          status: "SUBMITTED",
          updatedBy: ctx.session.user.id,
        })
        .where(eq(org.id, _org.id));
      return {
        code: "SUCCESS",
        message: `Submitted for organisation.`,
      };
    });
  });
