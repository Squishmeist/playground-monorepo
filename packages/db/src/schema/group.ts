import { sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { userRole } from "./auth";
import { auditFields } from "./base";

export const group = sqliteTable("group", (t) => ({
  id: t.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  name: t.text().notNull(),
  description: t.text(),
  ...auditFields,
}));

export const groupUser = sqliteTable("group_user", (t) => ({
  userId: t.text({ length: 256 }).notNull().unique(),
  groupId: t.integer({ mode: "number" }).notNull(),
  role: t
    .text()
    .references(() => userRole.name)
    .notNull()
    .default("USER"),
  ...auditFields,
}));

export const CreateGroupSchema = createInsertSchema(group, {
  name: z.string().max(256),
  description: z.string().max(256).optional(),
}).omit({
  id: true,
  createdAt: true,
  createdBy: true,
  updatedAt: true,
  updatedBy: true,
});

export const CreateGroupUserSchema = createInsertSchema(groupUser, {
  userId: z.string().max(256),
  groupId: z.number(),
  role: z.enum(["USER", "ADMIN"]).default("USER").optional(),
}).omit({
  createdAt: true,
  createdBy: true,
  updatedAt: true,
  updatedBy: true,
});
