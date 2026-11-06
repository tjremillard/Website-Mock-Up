// Local helper: receive a password on stdin; never print or save the password.
import { randomBytes, scryptSync } from "node:crypto";
let password = "";
for await (const chunk of process.stdin) password += chunk;
password = password.replace(/\r?\n$/, "");
if (password.length < 16 || password.length > 256) {
  console.error("Choose a password between 16 and 256 characters.");
  process.exit(1);
}
const salt = randomBytes(16).toString("hex");
console.log(
  `AIR_VISION_PASSWORD_HASH=scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`,
);
console.log(`AIR_VISION_SESSION_SECRET=${randomBytes(32).toString("hex")}`);
