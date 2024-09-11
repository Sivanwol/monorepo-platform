import { get } from "@vercel/edge-config";

import { protectedProcedure, publicProcedure } from "@app/auth";
import { env } from "@app/auth/env";
import { EdgeConfig, logger } from "@app/utils";

export const settingsRouter = {
  checkMaintenanceStatus: publicProcedure.query(async () => {
    await logger.log("checking maintenance status");
    try {
      const res = await get(EdgeConfig.backofficeMaintenance);
      await logger.info("maintenance status:", { status: !!res, res });
      return { status: !!res };
    } catch (error) {
      await logger.error("Error checking maintenance status:", { error });
      return { status: false };
    }
  }),
};
