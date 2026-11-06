import { test, expect } from "@playwright/test";
test("all vision descendants and RSC requests reject unauthenticated access", async ({
  request,
}) => {
  for (const path of [
    "/vision",
    "/vision/app",
    "/vision/app/intelligence",
    "/vision/app/explore",
    "/vision/app/portfolio",
    "/vision/not-a-page",
  ]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(response.headers()["location"]).toContain("/vision-access");
    expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow");
    const forged = await request.get(path, {
      headers: { Cookie: "air-vision-session=forged", RSC: "1" },
      maxRedirects: 0,
    });
    expect(forged.status()).toBe(307);
  }
});
test("vision API rejects cross-origin requests", async ({ request }) => {
  const response = await request.post("/api/vision-auth", {
    headers: { Origin: "https://untrusted.example" },
    data: { password: "not-valid" },
  });
  expect(response.status()).toBe(403);
});
test("configured vision gate creates a signed HttpOnly session and unified filters work", async ({
  page,
  context,
  request,
}) => {
  test.skip(
    process.env.AIR_E2E_VISION !== "1",
    "Run with AIR_E2E_VISION=1 to configure ephemeral test-only server secrets.",
  );
  await page.goto("/vision/app");
  await expect(page).toHaveURL(/vision-access/);
  await page
    .getByLabel("Internal preview password")
    .fill("wrong-preview-password");
  await page.getByRole("button", { name: "Open internal preview" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(
    "Access denied",
  );
  await page
    .getByLabel("Internal preview password")
    .fill("air-test-preview-only");
  await page.getByRole("button", { name: "Open internal preview" }).click();
  await expect(page).toHaveURL("/vision/app");
  await expect(
    page.getByRole("heading", { name: "Good morning, Alex." }),
  ).toBeVisible();
  const cookie = (await context.cookies()).find(
    (c) => c.name === "air-vision-session",
  );
  expect(cookie?.httpOnly).toBeTruthy();
  expect(cookie?.sameSite).toBe("Lax");
  expect(cookie?.path).toBe("/vision");
  await page.getByRole("button", { name: "Solar", exact: true }).click();
  await expect(page).toHaveURL(/market=solar/);
  await page
    .getByRole("combobox", { name: "Geography", exact: true })
    .selectOption("Pennsylvania");
  await expect(page.getByTestId("vision-property-count")).toHaveText("2");
  await expect(page.locator(".air-feed-card")).toHaveCount(1);
  await expect(page.locator(".air-activity-row")).toHaveCount(1);
  await page.locator(".air-activity-row").click();
  await expect(page.locator(".air-focus-pin")).toContainText(
    "Solar site study",
  );
  await page.locator(".air-rail-property").first().click();
  await expect(
    page.getByText("Model not yet available", { exact: true }),
  ).toBeVisible();
  await page.locator(".air-feed-card").click();
  await expect(
    page.getByRole("dialog", { name: "Intelligence detail" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("combobox", { name: "Geography", exact: true })
    .selectOption("Texas");
  await expect(page.locator(".air-feed-card")).toHaveCount(0);
  await expect(
    page.getByText("No sample intelligence matches these filters.", {
      exact: false,
    }),
  ).toBeVisible();
  const fail = await request.post("/api/vision-auth", {
    headers: { Origin: "http://localhost:3100" },
    data: { password: "not-valid" },
  });
  expect(fail.status()).toBe(401);
});
test("unconfigured gate fails closed", async ({ request }) => {
  test.skip(
    process.env.AIR_E2E_VISION === "1",
    "This case covers the default deployment with no secrets.",
  );
  const response = await request.post("/api/vision-auth", {
    headers: { Origin: "http://localhost:3100" },
    data: { password: "anything" },
  });
  expect(response.status()).toBe(503);
});

test("vision gate limits password attempts", async ({ request }) => {
  test.skip(
    process.env.AIR_E2E_VISION !== "1",
    "Requires ephemeral configured gate.",
  );
  let limited = false;
  for (let attempt = 0; attempt < 21; attempt++) {
    const response = await request.post("/api/vision-auth", {
      headers: { Origin: "http://localhost:3100" },
      data: { password: "wrong-preview-password" },
    });
    if (response.status() === 429) {
      expect(response.headers()["retry-after"]).toBe("900");
      limited = true;
      break;
    }
    expect(response.status()).toBe(401);
  }
  expect(limited).toBeTruthy();
});
