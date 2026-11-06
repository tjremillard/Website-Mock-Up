import { test, expect } from "@playwright/test";
test("homepage search handles unknowns and links seeded records", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "wireless infrastructure",
  );
  await page
    .getByLabel("Start with your Massachusetts property")
    .fill("a property we do not know");
  await page
    .getByRole("button", { name: "Explore property", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "We don't have this property",
  );
  await page
    .getByLabel("Start with your Massachusetts property")
    .fill("Boston");
  await page
    .getByRole("link", { name: "Boston demo property A", exact: false })
    .click();
  await expect(page).toHaveURL(/\/app\/property\/ma-1$/);
  await expect(
    page
      .getByRole("region", { name: "Property details" })
      .getByText("Demo property — not a real listing"),
  ).toBeVisible();
  await expect(page.getByText("Unknown · verification required")).toBeVisible();
});
test("free signup returns to saved property, claim stays pending and SCIP cannot publish", async ({
  page,
}) => {
  await page.goto("/app/property/ma-1");
  await page
    .getByRole("button", { name: "Save Property", exact: true })
    .click();
  await expect(page).toHaveURL(/sign-up.*returnTo/);
  await page.getByLabel("Name", { exact: true }).fill("Demo Owner");
  await page.getByLabel("Email", { exact: true }).fill("owner@example.test");
  await page.getByRole("button", { name: "Create free demo account" }).click();
  await expect(page).toHaveURL(/\/app\/property\/ma-1\?intent=save/);
  await expect(
    page.getByRole("button", { name: "Remove saved property" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Remove saved property" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Claim Property", exact: true })
    .click();
  await page.getByLabel("Relationship to property").selectOption("Owner");
  await page.getByLabel("Contact email").fill("owner@example.test");
  await page.getByRole("button", { name: "Submit demo claim" }).click();
  await expect(
    page.locator(".air-claim-form").getByRole("status"),
  ).toContainText("Verification required");
  await page.getByRole("link", { name: "Preview SCIP", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("SCIP");
  await expect(
    page.getByRole("button", { name: "Publish — unavailable" }),
  ).toBeDisabled();
  await page.goto("/app/my-properties");
  await expect(page.getByText("Pending demo claim")).toBeVisible();
  await page.goto("/app/saved");
  await page.getByRole("button", { name: "Remove saved property" }).click();
  await expect(
    page.getByRole("heading", { name: "No saved properties yet." }),
  ).toBeVisible();
});
test("map search, markers and layers use URL state", async ({ page }) => {
  await page.goto("/app?q=Boston");
  await expect(page.locator(".air-result")).toHaveCount(2);
  await page.locator(".air-result").first().click();
  await expect(page).toHaveURL(/property=ma-1/);
  await expect(
    page.getByRole("region", { name: "Property details" }),
  ).toContainText("Boston demo property A");
  await expect(page.locator(".air-infra-pin")).toHaveCount(15);
  await page
    .getByLabel("Illustrative development signals", { exact: true })
    .check();
  await expect(page.locator(".air-infra-pin")).toHaveCount(21);
  await page
    .getByLabel("Existing wireless infrastructure", { exact: true })
    .uncheck();
  await expect(page.locator(".air-infra-pin")).toHaveCount(6);
  await page
    .getByRole("button", { name: "Close property details", exact: true })
    .click();
  await expect(page.locator(".air-detail-sheet")).toHaveCount(0);
  await page.goBack();
  await expect(page.locator(".air-detail-sheet")).toHaveCount(1);
});
test("intelligence filters, pricing and Pro interest are functional", async ({
  page,
}) => {
  await page.goto("/intelligence");
  await page.getByLabel("Search intelligence").fill("rooftops");
  await expect(page.locator(".air-editorial")).toHaveCount(1);
  await page.locator(".air-editorial").click();
  await expect(
    page.getByRole("heading", { name: "What this means for landlords" }),
  ).toBeVisible();
  await page.goto("/pricing");
  await expect(page.getByText("TBD", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Preview Pro interest" }).click();
  await expect(page).toHaveURL(/app\/account/);
  await expect(
    page.getByRole("link", { name: "Create a free demo account" }),
  ).toBeVisible();
});
test("public routes fit mobile, tablet and desktop", async ({ page }) => {
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/intelligence",
      "/intelligence/satellite-to-cellular",
      "/how-it-works",
      "/pricing",
      "/about",
      "/app",
      "/app/property/ma-1",
      "/app/saved",
      "/app/my-properties",
      "/app/scip/ma-1",
      "/app/account",
      "/sign-in",
      "/sign-up",
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
test("mobile menu and map detail sheet are usable", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByRole("button", { name: "Menu" }).click();
  await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
  await page.getByRole("link", { name: "Explore", exact: true }).click();
  await page.locator(".air-result").first().click();
  await page.locator(".air-detail-sheet").scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("button", { name: "Close property details", exact: true }),
  ).toBeVisible();
});
