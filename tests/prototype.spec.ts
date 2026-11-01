import { test, expect } from "@playwright/test";
test("Explore feasibility preview, stable scores, resubmission and pricing", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".site-header nav a")).toHaveText([
    "Explore",
    "Easement Income",
    "Property Owners",
    "Infrastructure Developers",
  ]);
  await expect(page.locator(".landing h1")).toHaveCSS("font-size", "38px");
  await expect(
    page.getByText(
      "Enter an address to receive our Easement Marketing Feasibility Analysis.",
    ),
  ).toBeVisible();
  const input = page.getByLabel("Enter your property address");
  const submit = page.getByRole("button", {
    name: "Explore Property",
    exact: true,
  });
  await input.fill("   ");
  await submit.click();
  await expect(page.getByRole("meter")).toHaveCount(0);
  await page.evaluate(() => {
    Math.random = () => 0;
  });
  await input.fill("  123 Main Street  ");
  await submit.click();
  await expect(page.locator(".submitted-address")).toHaveText(
    "123 Main Street",
  );
  const meters = page.getByRole("meter");
  await expect(meters).toHaveCount(4);
  const categories = [
    "Wireless Infrastructure Feasibility",
    "Solar Feasibility",
    "Battery Energy Storage Feasibility",
    "Outdoor Advertising Feasibility",
  ];
  for (const category of categories) {
    await expect(
      page.getByRole("meter", { name: category, exact: true }),
    ).toHaveAttribute("aria-valuenow", "0");
  }
  await expect(page.locator(".map-canvas")).toHaveCount(0);
  await expect(
    page.getByText(
      "Prototype preview: these scores are randomly generated for demonstration purposes.",
    ),
  ).toBeVisible();
  // Editing the controlled input rerenders Explore without generating new scores.
  await page.evaluate(() => {
    Math.random = () => 0.999999;
  });
  await input.fill("9 Summer Street");
  for (const meter of await meters.all())
    await expect(meter).toHaveAttribute("aria-valuenow", "0");
  await expect(page.locator(".submitted-address")).toHaveText(
    "123 Main Street",
  );
  await submit.click();
  await expect(page.locator(".submitted-address")).toHaveText(
    "9 Summer Street",
  );
  for (const meter of await meters.all())
    await expect(meter).toHaveAttribute("aria-valuenow", "100");
  // Four independent draws, including the middle of the spectrum.
  await page.evaluate(() => {
    let draw = 0;
    const values = [0, 0.5, 0.999999, 0.25];
    Math.random = () => values[draw++ % 4];
  });
  await submit.click();
  await expect(page.locator(".feasibility-dial strong")).toHaveText([
    "0%",
    "50%",
    "100%",
    "25%",
  ]);
  await expect(page.locator(".feasibility-grid")).toHaveCSS(
    "grid-template-columns",
    /(?:[\d.]+px\s+){3}[\d.]+px/,
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".feasibility-grid")).toHaveCSS(
    "grid-template-columns",
    /^[\d.]+px$/,
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page
    .getByRole("link", {
      name: "Subscribe to get the full report and receive Easement Real Estate’s Marketing Services!",
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(/#owner\/pricing$/);
  await expect(
    page.getByRole("heading", { name: "Marketing Services pricing" }),
  ).toBeVisible();
  await expect(
    page.locator(".site-header nav a[aria-current='page']"),
  ).toHaveText("Property Owners");
  await expect(
    page.getByText("Pricing and subscription details are coming soon."),
  ).toBeVisible();
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

test("Easement Income explains the market and routes both audiences", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: "Easement Income", exact: true })
    .click();
  await expect(page).toHaveURL(/#income$/);
  await expect(
    page.locator(".site-header nav a[aria-current='page']"),
  ).toHaveText("Easement Income");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Your property’s potential goes beyond its traditional tenants.",
  );
  await expect(
    page.getByText(
      "A legal easement is a specific property right; not every opportunity on our platform requires one.",
      { exact: false },
    ),
  ).toBeVisible();
  for (const category of [
    "Connectivity",
    "Energy Generation",
    "Energy Storage",
    "Advertising",
  ]) {
    await expect(
      page.getByRole("heading", { name: category, exact: true }),
    ).toBeVisible();
  }
  await expect(
    page.getByText("Free for infrastructure developers.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("button")).toHaveCount(0);
  await page
    .getByRole("link", {
      name: "Explore Your Property’s Potential",
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(/#explore$/);
  await expect(
    page.getByRole("button", { name: "Explore Property", exact: true }),
  ).toBeVisible();
  await page.goBack();
  await page.getByRole("link", { name: "Find Sites", exact: true }).click();
  await expect(page).toHaveURL(/#developer$/);
  await expect(
    page.locator(".site-header nav a[aria-current='page']"),
  ).toHaveText("Infrastructure Developers");
  await page.goto("/#income");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await expect(page.locator(".income-categories")).toHaveCSS(
    "grid-template-columns",
    /^[\d.]+px$/,
  );
  await expect(page.locator(".income-audiences")).toHaveCSS(
    "grid-template-columns",
    /^[\d.]+px$/,
  );
  await page.screenshot({
    path: "test-results/income-mobile.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.screenshot({
    path: "test-results/income-desktop.png",
    fullPage: true,
  });
});
