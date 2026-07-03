import { randomInt } from "crypto";

// Excludes visually ambiguous characters (0/O, 1/l/I) so temporary
// passwords are easy to read and retype from a printed/shared list.
const CHARSET = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

export function generateTempPassword(length = 10): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CHARSET[randomInt(CHARSET.length)];
  }
  return out;
}
