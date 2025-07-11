import { OTLPHttpJsonTraceExporter, registerOTel } from "@vercel/otel";

import { env } from "./env";

export function register() {
  registerOTel({
    serviceName: "nextjs",
    traceExporter: new OTLPHttpJsonTraceExporter({
      url: env.TELEMETRY_TRACE_HOST,
    }),
  });
}
