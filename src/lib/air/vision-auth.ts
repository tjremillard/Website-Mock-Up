import "server-only";
import {
  createHmac,
  createHash,
  randomBytes,
  scrypt as nodeScrypt,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
const scrypt = promisify(nodeScrypt);
export const visionCookie = "air-vision-session";
export const sessionSeconds = 8 * 60 * 60;
function config() {
  const hash = process.env.AIR_VISION_PASSWORD_HASH ?? "";
  const secret = process.env.AIR_VISION_SESSION_SECRET ?? "";
  if (
    !/^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(hash) ||
    !/^[a-f0-9]{64,}$/.test(secret)
  )
    return null;
  return { hash, secret };
}
export function visionConfigured() {
  return config() !== null;
}
function equal(a: string, b: string) {
  const aa = Buffer.from(a),
    bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}
export async function verifyVisionPassword(password: string) {
  const c = config();
  if (!c || password.length < 1 || password.length > 256) return false;
  const [, salt, expected] = c.hash.split(":");
  const result = (await scrypt(password, salt, 64)) as Buffer;
  return equal(result.toString("hex"), expected);
}
export function createVisionSession() {
  const c = config();
  if (!c) throw new Error("Vision gate is not configured");
  const payload = Buffer.from(
    JSON.stringify({
      expires: Date.now() + sessionSeconds * 1000,
      nonce: randomBytes(16).toString("hex"),
      version: createHash("sha256").update(c.hash).digest("hex"),
    }),
  ).toString("base64url");
  return `${payload}.${createHmac("sha256", c.secret).update(payload).digest("base64url")}`;
}
export function validVisionSession(token?: string) {
  const c = config();
  if (!c || !token || token.length > 2048) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;
  if (
    !equal(
      createHmac("sha256", c.secret).update(payload).digest("base64url"),
      signature,
    )
  )
    return false;
  try {
    const p = JSON.parse(Buffer.from(payload, "base64url").toString());
    return (
      typeof p.expires === "number" &&
      p.expires > Date.now() &&
      p.expires <= Date.now() + sessionSeconds * 1000 &&
      p.version === createHash("sha256").update(c.hash).digest("hex")
    );
  } catch {
    return false;
  }
}
export function visionReturn(value: unknown) {
  if (typeof value !== "string") return "/vision";
  try {
    const u = new URL(value, "https://air.invalid");
    return u.origin === "https://air.invalid" &&
      (u.pathname === "/vision" || u.pathname.startsWith("/vision/"))
      ? u.pathname + u.search
      : "/vision";
  } catch {
    return "/vision";
  }
}
