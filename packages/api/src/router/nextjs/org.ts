import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { eq } from "@squishmeist/db";
import {
  org,
  orgAddress,
  orgContractorSignup,
  OrgContractorStep1Schema,
  OrgContractorStep2Schema,
  OrgContractorStep3Schema,
  OrgContractorStep4Schema,
} from "@squishmeist/db/schema";

import { protectedProcedure } from "../../trpc";

const orgNotFound = (desc?: string) =>
  new TRPCError({
    code: "BAD_REQUEST",
    message: `Organisation ${desc} not found`,
  });

const orgNotInProgress = new TRPCError({
  code: "BAD_REQUEST",
  message: "Organisation is not in progress",
});

export const orgRoute = {
  accessStep: protectedProcedure
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
    }),

  getContractorStep1: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.org.findFirst({
      where: (org, { eq }) => eq(org.applicantId, ctx.session.user.id),
      columns: { name: true },
    });
  }),
  getContractorStep2: protectedProcedure.query(async ({ ctx }) => {
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
  }),
  getContractorStep3: protectedProcedure.query(async ({ ctx }) => {
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
      if (_org.step < 3)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Cannot skip to step 3 for organisation.`,
        });

      if (!_org.step3Data) return undefined;

      const parse = OrgContractorStep3Schema.safeParse(
        JSON.parse(_org.step3Data),
      );
      if (!parse.success)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Step 3 data is invalid",
        });

      return parse.data;
    });
  }),
  getContractorStep4: protectedProcedure.query(async ({ ctx }) => {
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
  }),

  contractorStep1: protectedProcedure
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
        if (!orgId)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Organisation not created",
          });
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
    }),
  contractorStep2: protectedProcedure
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
    }),
  contractorStep3: protectedProcedure
    .input(OrgContractorStep3Schema)
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

        if (_org.step < 3)
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `Cannot skip to step 3 for organisation.`,
          });
        await tx
          .update(orgContractorSignup)
          .set({
            step: _org.step < 4 ? 4 : _org.step,
            step3Data: JSON.stringify(input),
            updatedBy: ctx.session.user.id,
          })
          .where(eq(orgContractorSignup.orgId, _org.id));
        return {
          code: "SUCCESS",
          message: `Submitted for organisation.`,
        };
      });
    }),
  contractorStep4: protectedProcedure
    .input(OrgContractorStep4Schema)
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
        // update the org status to submitted
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
    }),
} satisfies TRPCRouterRecord;
