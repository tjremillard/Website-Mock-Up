import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
test("capture all four experiences and verify protected responsive routes", async ({
  page,
}) => {
  test.skip(
    !process.env.AIR_CAPTURE_OUTPUT || process.env.AIR_E2E_VISION !== "1",
    "Opt-in screenshots with ephemeral preview access.",
  );
  test.setTimeout(90000);
  const output = process.env.AIR_CAPTURE_OUTPUT!;
  await mkdir(output, { recursive: true });
  await page.goto("/vision-access");
  await page
    .getByLabel("Internal preview password")
    .fill("air-test-preview-only");
  await page.getByRole("button", { name: "Open internal preview" }).click();
  await expect(page).toHaveURL("/vision");
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const [name, route] of [
      ["launch-marketing", "/"],
      ["launch-explore", "/app?property=ma-1"],
      ["vision-marketing", "/vision"],
      ["vision-application", "/vision/app"],
    ]) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} at ${width}`,
      ).toBeTruthy();
      if (
        route.startsWith("/app") ||
        route === "/vision/app" ||
        route === "/vision"
      )
        await expect(page.locator(".air-interactive-map")).toBeVisible();
      if (width !== 768) {
        await page.screenshot({
          path: path.join(
            output,
            `${name}-${width === 375 ? "mobile" : "desktop"}.png`,
          ),
          fullPage: true,
          animations: "disabled",
        });
      }
    }
    for (const route of [
      "/vision/app/intelligence",
      "/vision/app/explore",
      "/vision/app/portfolio",
      "/vision/app?view=pro",
      "/vision/app?view=marketplace",
    ]) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} at ${width}`,
      ).toBeTruthy();
    }
  }
});
