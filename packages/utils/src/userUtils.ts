import { compareSync, genSaltSync, hashSync } from "bcrypt-edge";

// Define a function to salt and hash a password
export const saltAndHashPassword = (password: string): string => {
  const saltRounds = 10;
  const salt = genSaltSync(saltRounds);
  const hashedPassword = hashSync(password, salt);
  return hashedPassword;
};

export const IsVerifyPassword = (
  password: string,
  hashedPassword: string,
): boolean => {
  return compareSync(password, hashedPassword);
};
