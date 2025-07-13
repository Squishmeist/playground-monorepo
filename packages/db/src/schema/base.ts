import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { user } from "./auth";

export const auditFields = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  createdBy: text("created_by")
    .references(() => user.id)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdateFn(() => new Date()),
  updatedBy: text("updated_by")
    .references(() => user.id)
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  deletedBy: text("deleted_by").references(() => user.id),
};

export const flag = sqliteTable("flag", (t) => ({
  name: t.text().notNull().unique(),
  description: t.text(),
  enabled: t.integer({ mode: "boolean" }).notNull(),
  ...auditFields,
}));
