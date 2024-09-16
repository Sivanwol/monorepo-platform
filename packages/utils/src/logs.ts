import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import winston from "winston";

const { combine, timestamp, json } = winston.format;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const logtail = new Logtail(process.env.NEXT_PUBLIC_BETTER_LOGS_TOKEN!);

export const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.Console(), new LogtailTransport(logtail)],
});
