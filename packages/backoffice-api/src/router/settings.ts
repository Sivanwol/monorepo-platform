import { EdgeConfig } from "@app/utils";
import { protectedProcedure } from "../trpc";
import type { TRPCRouterRecord } from "@trpc/server";
import { get } from "@vercel/edge-config";

export const settingsRouter = {
  maintenanceStatus: protectedProcedure.query(async () => {
    const res = await get(EdgeConfig.backofficeMaintenance)
    return { status: res === "true" };
  }),
} satisfies TRPCRouterRecord;
