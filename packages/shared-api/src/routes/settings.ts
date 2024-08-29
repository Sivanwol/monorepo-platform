import { get } from "@vercel/edge-config";

import { protectedProcedure, publicProcedure } from "@app/auth";
import { env } from "@app/auth/env";
import { EdgeConfig } from "@app/utils";

export const settingsRouter = {
  checkMaintenanceStatus: publicProcedure.query(async () => {
    console.log("checking maintenance status");
    try {
      const res = await get(EdgeConfig.backofficeMaintenance);
      console.log("maintenance status:", res);
      return { status: !!res };
    } catch (error) {
      console.error("Error checking maintenance status:", error);
      return { status: false };
    }
  }),
};
