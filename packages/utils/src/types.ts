import type { Namespaces } from "./translations";

export const genders = ["male", "female", "other"] as const;
export type Gender = "male" | "female" | "other";

/** User base details from Descope API */
export interface User {
  email?: string;
  name?: string;
  givenName?: string;
  middleName?: string;
  familyName?: string;
  phone?: string;
}
/** User extended details from Descope API */
export type UserResponse = User & {
  loginIds: string[];
  userId: string;
  verifiedEmail?: boolean;
  verifiedPhone?: boolean;
  picture?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customAttributes?: Record<string, any>;
  status: string;
};

export interface UserAuditInfo {
  device: string;
  geo: string;
  remoteAddress: string;
  browser: string;
  os: string;
  osVersion: string;
  providerName: string;
  occurred: Date;
}

export interface SupportProps {
  lng: string;
  ns: Namespaces;
}

export interface BreadcrumbProps {
  homepageTitle: string;
}
