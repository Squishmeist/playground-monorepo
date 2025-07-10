import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

if (!process.env.DB_URL) throw new Error("DB_URL is required");

const client = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_AUTH_TOKEN,
});

export const db = drizzle({
  client,
  schema,
  casing: "snake_case",
});
