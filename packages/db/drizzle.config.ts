import type { Config } from "drizzle-kit";

if (!process.env.DB_URL) throw new Error("Missing DB_URL");

export default {
  schema: "./src/schema/index.ts",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DB_URL,
    authToken: process.env.DB_AUTH_TOKEN,
  },
  casing: "snake_case",
} satisfies Config;
