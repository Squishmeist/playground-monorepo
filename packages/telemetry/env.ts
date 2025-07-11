import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export function env() {
  return createEnv({
    server: {
      TELEMETRY_HOST: z.string().min(1),
      TELEMETRY_AUTH: z.string().min(1),
      NODE_ENV: z.enum(["development", "production"]).optional(),
    },
    runtimeEnvStrict: {
      TELEMETRY_HOST: process.env.TELEMETRY_HOST,
      TELEMETRY_AUTH: process.env.TELEMETRY_AUTH,
      NODE_ENV: process.env.NODE_ENV,
    },
    skipValidation:
      !!process.env.CI || process.env.npm_lifecycle_event === "lint",
  });
}
