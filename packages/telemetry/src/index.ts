import { createLogger, format, transport, transports } from "winston";

import { tryCatch } from "@squishmeist/util";

import { env } from "../env";

const _transports: transport[] = [
  new transports.Console({
    format: format.combine(format.colorize(), format.simple()),
  }),
];

if (env().NODE_ENV === "production") {
  _transports.push(
    new (class LokiTransport extends transports.Http {
      async log(info: unknown) {
        await sendLogToLoki(info);
      }
    })(),
  );
}

export const logger = createLogger({
  level: "debug",
  transports: _transports,
});

async function sendLogToLoki(info: unknown) {
  const response = await tryCatch(
    fetch(`${env().TELEMETRY_LOG_HOST}/loki/api/v1/push`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env().TELEMETRY_LOG_AUTH}`,
      },
      body: JSON.stringify({
        streams: [
          {
            stream: { service: "playground" },
            values: [[`${Date.now()}000000`, JSON.stringify(info)]],
          },
        ],
      }),
    }),
  );

  if (response.error) {
    console.error("Error sending log to Loki:", response.error);
    return;
  }
  console.log("Loki response:", response.data.status);
}
