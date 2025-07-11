import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const auditFields = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("edited_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`unixepoch()`),
};

export const flag = sqliteTable("flag", (t) => ({
  id: t.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  name: t.text().notNull(),
  description: t.text(),
  enabled: t.integer({ mode: "boolean" }).notNull(),
  ...auditFields,
}));

export const Post = sqliteTable("post", (t) => ({
  id: t
    .text({ length: 256 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: t.text({ length: 256 }).notNull(),
  content: t.text().notNull(),
  ...auditFields,
}));

export const CreatePostSchema = createInsertSchema(Post, {
  title: z.string().max(256),
  content: z.string().max(256),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
