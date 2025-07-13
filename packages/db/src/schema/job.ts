import { sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { user } from "./auth";
import { auditFields } from "./base";
import { group } from "./group";

export const job = sqliteTable("job", (t) => ({
  id: t.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  title: t.text().notNull(),
  description: t.text(),
  assignedTo: t.text({ length: 256 }).references(() => user.id),
  assignedBy: t.text({ length: 256 }).references(() => user.id),
  group: t.integer({ mode: "number" }).references(() => group.id),
  ...auditFields,
}));

export const CreateJobSchema = createInsertSchema(job, {
  title: z.string().max(256),
  description: z.string().max(1024).optional(),
  group: z.number().optional(),
  assignedTo: z.string().max(256).optional(),
}).omit({
  id: true,
  createdAt: true,
  createdBy: true,
  updatedAt: true,
  updatedBy: true,
});
