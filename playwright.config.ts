import { randomBytes, scryptSync } from "node:crypto";
import { defineConfig } from "@playwright/test";
const visionTest = process.env.AIR_E2E_VISION === "1";
const salt = randomBytes(16).toString("hex");
const visionEnv: Record<string, string> = visionTest
  ? {
      AIR_VISION_PASSWORD_HASH: `scrypt:${salt}:${scryptSync("air-test-preview-only", salt, 64).toString("hex")}`,
      AIR_VISION_SESSION_SECRET: randomBytes(32).toString("hex"),
    }
  : {};
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  use: {
    baseURL: "http://localhost:3100",
    headless: true,
    trace: "retain-on-failure",
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : {},
  },
  webServer: {
    command: "npm run start -- --hostname localhost --port 3100",
    env: visionEnv,
    url: "http://localhost:3100",
    reuseExistingServer: false,
    timeout: 30000,
  },
});
