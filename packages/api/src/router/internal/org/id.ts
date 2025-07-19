import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { and, eq, isNull } from "@squishmeist/db";
import {
  org,
  orgContractorSignup,
  OrgContractorStep3Schema,
  OrgContractorStep4Schema,
  OrgSchema,
} from "@squishmeist/db/schema";

import { protectedProcedure } from "../../../trpc";

const ApprovedResponseSchema = z.object({
  code: z.literal("APPROVED"),
  message: z.string(),
  data: OrgSchema,
});

const NotApprovedResponseSchema = z.object({
  code: z.literal("NOT_APPROVED"),
  message: z.string(),
  data: z.object({
    org: OrgSchema,
    step3: OrgContractorStep3Schema.optional(),
    step4: OrgContractorStep4Schema.optional(),
  }),
});

const NotFoundResponseSchema = z.object({
  code: z.literal("NOT_FOUND"),
  message: z.string(),
});

const OrgResponseSchema = z.discriminatedUnion("code", [
  ApprovedResponseSchema,
  NotApprovedResponseSchema,
  NotFoundResponseSchema,
]);

export const id = protectedProcedure
  .input(z.number())
  .output(OrgResponseSchema)
  .query(async ({ ctx, input }) => {
    const _org = await ctx.db.query.org.findFirst({
      where: and(eq(org.id, input), isNull(org.deletedAt)),
    });

    if (!_org)
      return {
        code: "NOT_FOUND",
        message: "Organisation not found",
      };

    if (_org.status !== "APPROVED") {
      const signup = await ctx.db.query.orgContractorSignup.findFirst({
        where: and(
          eq(orgContractorSignup.orgId, input),
          isNull(orgContractorSignup.deletedAt),
        ),
        columns: {
          step: true,
          step3Data: true,
          step4Data: true,
        },
      });

      if (!signup) {
        return {
          code: "NOT_FOUND",
          message: "Organisation signup not found",
        };
      }

      const parse3 = OrgContractorStep3Schema.optional().safeParse(
        JSON.parse(signup.step3Data ?? "null"),
      );
      if (!parse3.success)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Step 3 data is invalid",
        });

      const parse4 = OrgContractorStep4Schema.optional().safeParse(
        JSON.parse(signup.step4Data ?? "null"),
      );
      if (!parse4.success)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Step 4 data is invalid",
        });

      return {
        code: "NOT_APPROVED",
        message: "Organisation is not approved",
        data: {
          org: _org,
          step3: parse3.data,
          step4: parse4.data,
        },
      };
    }

    return {
      code: "APPROVED",
      message: "Organisation is approved",
      data: _org,
    };
  });
