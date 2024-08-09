import { EdgeConfig } from "@app/utils";
import { get } from "@vercel/edge-config";
import { protectedProcedure } from "../trpc";
import { env } from "@app/auth/env";

export const settingsRouter = {
  checkMaintenanceStatus: protectedProcedure.query(async () => {
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
