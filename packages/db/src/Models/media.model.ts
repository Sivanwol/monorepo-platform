import type * as schema from "../schema";

export interface MediaModel {
  id: number;
  alias: string;
  path: string;
  mineType: string;
  size: number;
  createAt: Date;
}
export const convertToMediaModel = (
  data: typeof schema.Media.$inferSelect,
): MediaModel => ({
  id: data.id,
  alias: data.alias,
  path: data.path,
  mineType: data.mineType,
  size: data.size,
  createAt: new Date(data.createdAt),
});
