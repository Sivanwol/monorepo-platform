import type * as schema from "../schema";
export interface UserModel {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  phone: string | null,
  country: string,
  city: string,
  isWorker: boolean,
  isPrivate: boolean,
  avatar: number | null,
  gender: "male" | "female" | "other",
  type: "personal" | "business" | "driver" | "driver+business",
  createdAt: Date
}
export const convertToUserModel = (data: typeof schema.User.$inferSelect): UserModel => ({
  id: data.id,
  firstName: data.firstName,
  lastName: data.lastName,
  email: data.email,
  phone: data.phone,
  country: data.country,
  city: data.city,
  avatar: data.avatarMediaId,
  isWorker: data.IsWorker ?? false,
  isPrivate: data.IsPrivate ?? false,
  gender: data.gender,
  type: data.type,
  createdAt: data.createdAt,
});
