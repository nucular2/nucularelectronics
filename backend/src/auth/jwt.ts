import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const accessSecret = process.env.JWT_ACCESS_SECRET || "";
const refreshSecret = process.env.JWT_REFRESH_SECRET || "";

export function signAccess(payload: object) {
  return jwt.sign(payload, accessSecret, { expiresIn: "15m" });
}

export function signRefresh(payload: object) {
  return jwt.sign(payload, refreshSecret, { expiresIn: "30d" });
}

export function verifyAccess(token: string) {
  return jwt.verify(token, accessSecret);
}

export function verifyRefresh(token: string) {
  return jwt.verify(token, refreshSecret);
}

export async function hashPassword(pwd: string) {
  return bcrypt.hash(pwd, 12);
}

export async function comparePassword(pwd: string, hash: string) {
  return bcrypt.compare(pwd, hash);
}
