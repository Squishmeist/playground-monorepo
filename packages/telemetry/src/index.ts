import winston from "winston";
import LokiTransport from "winston-loki";

import { env } from "../env";

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
  }),
];

if (env().NODE_ENV === "production") {
  transports.push(
    new LokiTransport({
      host: env().TELEMETRY_LOG_HOST,
      basicAuth: env().TELEMETRY_LOG_AUTH,
      labels: { service: "playground" },
      onConnectionError: (error) => {
        console.error("Loki connection error:", error);
      },
    }),
  );
}

export const logger = winston.createLogger({
  level: env().NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports,
});
