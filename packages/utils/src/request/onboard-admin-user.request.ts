import type { Gender } from "../types";

export interface OnBoardAdminUserRequest {
  firstName: string;
  lastName: string;
  gender: Gender;
  aboutMe?: string;
  avatar?: string;
  phone?: string;
}
