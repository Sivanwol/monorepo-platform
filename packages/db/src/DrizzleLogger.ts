import type { Logger } from "drizzle-orm/logger";

import { logger } from "@app/utils";

export class DrizzleLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    logger.info(`Executing query: ${query}`, { params });
  }
}
