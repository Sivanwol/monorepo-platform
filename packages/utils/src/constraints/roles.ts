import { backofficePermmisions } from "./permmisions";

export const backofficeRoles = {
  Admin: {
    roleSet: ["backoffice:admin"],
    permmisions: [backofficePermmisions.Access],
  },
};

export const platformRoles = {};
