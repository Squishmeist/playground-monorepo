import { sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { user } from "./auth";
import { auditFields } from "./base";

export const orgStatus = sqliteTable("org_status", (t) => ({
  name: t.text().primaryKey().unique(),
}));

export const org = sqliteTable("org", (t) => ({
  id: t.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  name: t.text().notNull(),
  applicantId: t
    .text({ length: 256 })
    .notNull()
    .unique()
    .references(() => user.id),
  status: t
    .text()
    .notNull()
    .references(() => orgStatus.name)
    .default("IN_PROGRESS"),
  ...auditFields,
}));

export const orgAddress = sqliteTable("org_address", (t) => ({
  orgId: t
    .integer({ mode: "number" })
    .primaryKey()
    .references(() => org.id),
  street: t.text().notNull(),
  city: t.text().notNull(),
  county: t.text().notNull(),
  postcode: t.text().notNull(),
  ...auditFields,
}));

export const orgContractor = sqliteTable("org_contractor", (t) => ({
  orgId: t
    .integer({ mode: "number" })
    .primaryKey()
    .references(() => org.id),
  numberEmployees: t.integer({ mode: "number" }).notNull(),
  areQualified: t.integer({ mode: "boolean" }).notNull(),
  hasInstalledEvPoint: t.integer({ mode: "boolean" }).notNull(),
  numPointsInstalled: t.integer({ mode: "number" }),
  ...auditFields,
}));

export const orgContractorStep = sqliteTable("org_contractor_step", (t) => ({
  num: t.integer({ mode: "number" }).primaryKey(),
  name: t.text().unique(),
}));

export const orgContractorSignup = sqliteTable(
  "org_contractor_signup",
  (t) => ({
    orgId: t
      .integer({ mode: "number" })
      .primaryKey()
      .references(() => org.id),
    step: t
      .integer({ mode: "number" })
      .notNull()
      .references(() => orgContractorStep.num),
    step3Data: t.text(),
    step4Data: t.text(),
    ...auditFields,
  }),
);

export const OrgSchema = createSelectSchema(org);
export const OrgContractorSignupSchema =
  createSelectSchema(orgContractorSignup);

export const OrgContractorStep1Schema = createInsertSchema(org).pick({
  name: true,
});

export const OrgContractorStep2Schema = createInsertSchema(orgAddress).pick({
  street: true,
  city: true,
  county: true,
  postcode: true,
});

export const OrgContractorStep3Schema = createInsertSchema(orgContractor).pick({
  numberEmployees: true,
  areQualified: true,
});

export const OrgContractorStep4Schema = createInsertSchema(orgContractor).pick({
  hasInstalledEvPoint: true,
  numPointsInstalled: true,
});
