import { z } from "zod/v4";

import { eq } from "@squishmeist/db";
import { org, orgContractorSignup } from "@squishmeist/db/schema";

import { protectedProcedure } from "../../../trpc";

export const accessStep = protectedProcedure
  .input(z.number())
  .output(
    z.object({
      code: z.enum(["ALLOWED", "FORBIDDEN", "NOT_IN_PROGRESS", "NOT_FOUND"]),
      message: z.string(),
      step: z.number(),
      status: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const response = await ctx.db
      .select({
        id: org.id,
        status: org.status,
        step: orgContractorSignup.step,
      })
      .from(org)
      .innerJoin(orgContractorSignup, eq(org.id, orgContractorSignup.orgId))
      .where(eq(org.applicantId, ctx.session.user.id));

    const _org = response[0];
    if (!_org) {
      // step 1 creates the org, so we allow access to step 1
      if (input === 1) {
        return {
          code: "ALLOWED",
          message: `Access to step ${input} for organisation.`,
          step: 1,
          status: "NOT_FOUND",
        };
      }
      return {
        code: "NOT_FOUND",
        message: "Organisation not found",
        step: 1,
        status: "NOT_FOUND",
      };
    }
    if (_org.status !== "IN_PROGRESS")
      return {
        code: "NOT_IN_PROGRESS",
        message: "Organisation is not in progress",
        step: _org.step,
        status: _org.status,
      };

    if (_org.step < input)
      return {
        code: "FORBIDDEN",
        message: `Cannot access step ${input} for organisation.`,
        step: _org.step,
        status: _org.status,
      };

    return {
      code: "ALLOWED",
      message: `Access to step ${input} for organisation.`,
      step: _org.step,
      status: _org.status,
    };
  });
