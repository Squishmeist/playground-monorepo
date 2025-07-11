import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export function env() {
  return createEnv({
    server: {
      TELEMETRY_LOG_HOST: z.string().min(1),
      TELEMETRY_LOG_AUTH: z.string().min(1),
      NODE_ENV: z.enum(["development", "production"]).optional(),
    },
    runtimeEnvStrict: {
      TELEMETRY_LOG_HOST: process.env.TELEMETRY_LOG_HOST,
      TELEMETRY_LOG_AUTH: process.env.TELEMETRY_LOG_AUTH,
      NODE_ENV: process.env.NODE_ENV,
    },
    skipValidation:
      !!process.env.CI || process.env.npm_lifecycle_event === "lint",
  });
}
