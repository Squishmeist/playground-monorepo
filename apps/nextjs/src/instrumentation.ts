import { OTLPHttpJsonTraceExporter, registerOTel } from "@vercel/otel";

import { env } from "./env";

export function register() {
  registerOTel({
    serviceName: "playground",
    traceExporter: new OTLPHttpJsonTraceExporter({
      url: env.TELEMETRY_TRACE_HOST,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.TELEMETRY_TRACE_AUTH}`,
      },
    }),
  });
}
