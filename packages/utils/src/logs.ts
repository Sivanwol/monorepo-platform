import { Logtail } from "@logtail/node";

export const logger = new Logtail(process.env.BETTER_LOGS_TOKEN ?? "");
