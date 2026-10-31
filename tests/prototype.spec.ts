import { test, expect } from "@playwright/test";
test("address explorer and map layers", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".site-header")).toHaveCSS("display", "flex");
  await expect(page.locator(".landing h1")).toHaveCSS("font-size", "38px");
  await expect(
    page.getByRole("heading", { name: "What’s possible at your property?" }),
  ).toBeVisible();
  await page.getByLabel("Enter your property address").fill("123 Main Street");
  await page.getByRole("button", { name: "Explore property" }).click();
  await expect(
    page.getByText("123 Main Street", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".map-marker")).toHaveCount(6);
  await page.getByLabel("FCC Database").uncheck();
  await expect(page.locator(".map-marker")).toHaveCount(4);
  await page.getByRole("link", { name: "Change address" }).click();
  await expect(page.getByLabel("Enter your property address")).toHaveValue(
    "123 Main Street",
  );
});
test("lease review checkout, manual stages, report and persistence", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/#services");
  await page.getByRole("link", { name: "Start my Lease Checkup" }).click();
  await expect(
    page.getByRole("heading", { name: "Start your Lease Checkup" }),
  ).toBeVisible();
  await page.getByRole("checkbox", { name: "Site Plan.pdf" }).uncheck();
  await page.getByRole("button", { name: "Continue to payment" }).click();
  await expect(
    page.getByText(
      "Checkout preview · no payment details collected or charges made",
    ),
  ).toBeVisible();
  await page.getByRole("button", { name: "Simulate payment & submit" }).click();
  await expect(
    page.getByRole("heading", { name: "Your review is submitted." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Track in My Properties" }).click();
  await expect(
    page.getByText("2 supporting documents attached.", { exact: false }),
  ).toBeVisible();
  for (const stage of ["AI analysis", "WRA review", "Completed"])
    await page
      .getByRole("button", {
        name: "Preview next stage: " + stage,
        exact: true,
      })
      .click();
  await page.reload();
  await page.getByRole("link", { name: "Open reviewed report" }).click();
  await page
    .getByRole("button", { name: "View sample source reference" })
    .click();
  await expect(
    page.getByText("Sample reference · Original Lease.pdf", { exact: false }),
  ).toBeVisible();
  await page
    .getByLabel("Ask about your findings")
    .fill("Please clarify the utility provision.");
  await page
    .getByRole("button", { name: "Preview clarification request" })
    .click();
  await expect(
    page.getByText("Saved clarification:", { exact: false }),
  ).toContainText("utility provision");
  expect(errors).toEqual([]);
});
test("owner opportunities, saved interest, and additional documents", async ({
  page,
}) => {
  await page.goto("/#owner/overview");
  await expect(page.getByText("T-Mobile escalation coming up")).toBeVisible();
  await page
    .getByRole("button", { name: "Learn more about Community Solar" })
    .click();
  await expect(
    page.getByRole("heading", { name: "What is community solar?" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Express interest · demo" })
    .first()
    .click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Interest saved in demo" }),
  ).toBeDisabled();
  await page.getByRole("link", { name: "Documents", exact: true }).click();
  await page.getByLabel("Document type").selectOption("Rent Reduction Request");
  await page
    .getByRole("button", { name: "Add sample document", exact: true })
    .click();
  await expect(page.locator(".document-row")).toHaveCount(4);
  await page.reload();
  await expect(page.locator(".document-row")).toHaveCount(4);
});
test("developer account, filters, access tiers, and pending inquiry", async ({
  page,
}) => {
  await page.goto("/#developer");
  await expect(page.locator(".property-card")).toHaveCount(2);
  await page.getByRole("link", { name: "Create your account" }).click();
  await page.getByLabel("Name", { exact: true }).fill("Demo Developer");
  await page.getByLabel("Users on your team").fill("3");
  await page.getByLabel("Minimum rooftop size").fill("10000");
  await page.getByLabel("Require access to the grid").check();
  await page.getByRole("button", { name: "Create demo account" }).click();
  await expect(page.locator(".property-card")).toHaveCount(1);
  await expect(page.locator(".property-card")).toContainText("123 Main Street");
  await page.reload();
  await expect(
    page.getByText("Welcome, Demo Developer.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear criteria" }).click();
  await page.getByRole("button", { name: "Preview paid access" }).click();
  await expect(page.locator(".property-card")).toHaveCount(3);
  await page
    .getByRole("button", { name: "View property & request introduction" })
    .nth(1)
    .click();
  await page
    .getByLabel("Your project and introduction request")
    .fill("We are exploring rooftop infrastructure.");
  await page
    .getByRole("button", { name: "Request introduction · demo" })
    .click();
  await page.getByRole("link", { name: "Pending Offers" }).click();
  await expect(
    page.getByText("We are exploring rooftop infrastructure."),
  ).toBeVisible();
  await expect(page.locator(".pending-row")).toHaveCount(2);
  await expect(page.getByText("Inquiry sent 2/17/2027")).toBeVisible();
  await page.reload();
  await expect(page.locator(".pending-row")).toHaveCount(2);
});
test("developer criteria use all requirements and show empty states", async ({
  page,
}) => {
  await page.goto("/#developer");
  await page.getByLabel("Maximum distance to fiber").fill("100");
  await expect(
    page.getByRole("heading", { name: "No matching properties" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear criteria" }).click();
  await page.getByLabel("Maximum distance to utilities").fill("150");
  await expect(page.locator(".property-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Clear criteria" }).click();
  await page.getByRole("button", { name: "List", exact: true }).click();
  await expect(page.locator(".property-card.horizontal")).toHaveCount(2);
});
test("SCIP billing and saved review draft retain selected plan", async ({
  page,
}) => {
  await page.goto("/#product/scip");
  await page.getByRole("radio").nth(1).check();
  await page.getByRole("link", { name: "Continue · $49/month" }).click();
  await page.getByRole("button", { name: "Save and return" }).click();
  await page.getByRole("link", { name: "Continue saved draft" }).click();
  await page
    .getByRole("button", { name: "Continue to payment · $49/month" })
    .click();
  await expect(
    page.getByText("$49/month · recurs monthly.", { exact: false }),
  ).toBeVisible();
});
test("mobile screens fit and original starter remains accessible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "",
    "services",
    "map",
    "owner/overview",
    "owner/documents",
    "owner/reviews",
    "developer",
    "account",
    "review/checkup",
    "product/relocation",
    "product/scip",
  ]) {
    await page.goto("/#" + route);
    await expect(page.locator("main h1").first()).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route,
    ).toBeTruthy();
  }
  await page.screenshot({
    path: "test-results/mobile-portal.png",
    fullPage: true,
  });
  await page.goto("/starter");
  await expect(
    page.getByRole("heading", { name: "Find room for your next chapter." }),
  ).toBeVisible();
});
