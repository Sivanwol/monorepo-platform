import { EdgeConfig } from "@app/utils";
import { get } from "@vercel/edge-config";
import { protectedProcedure } from "../trpc";

export const settingsRouter = {
  checkMaintenanceStatus: protectedProcedure.query(async () => {
    console.log("checking maintenance status");
    const res = await get(EdgeConfig.backofficeMaintenance)
    return { status: res === "true" };
  }),
}
