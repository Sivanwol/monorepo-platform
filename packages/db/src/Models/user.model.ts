import type * as schema from "../schema";

export interface UserModel {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  country: string;
  city: string;
  isWorker: boolean;
  isPrivate: boolean;
  avatar: string;
  gender: "male" | "female" | "other";
  createdAt: Date;
}
export const convertToUserModel = (
  data: typeof schema.User.$inferSelect,
): UserModel => ({
  id: data.id,
  firstName: data.firstName,
  lastName: data.lastName,
  email: data.email,
  phone: data.phone,
  country: data.country ?? "IL",
  city: data.city ?? "",
  avatar: data.avatar,
  isWorker: data.IsWorker ?? false,
  isPrivate: data.IsPrivate ?? false,
  gender: data.gender ?? "other",
  createdAt: data.createdAt,
});
