import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import type { DataTableType } from "@app/utils";
import { publicProcedure } from "@app/auth";
import { mockData } from "@app/utils";

export const mockRouter = {
  mockData: publicProcedure
    .input(z.object({ total: z.number() }))
    .query(({ ctx, input }) => {
      return {
        entities: mockData(input.total).map((item) => ({
          ...(item as unknown as DataTableType),
        })),
        total: input.total * 4,
      };
    }),
} satisfies TRPCRouterRecord;
