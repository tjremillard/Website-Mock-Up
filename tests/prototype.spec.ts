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
      name: "Subscribe to get the full report and begin marketing your property to infrastructure developers with Easement Exchange!",
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(/#owner\/pricing$/);
  await expect(
    page.getByRole("heading", {
      name: "Put your property’s potential to work.",
    }),
  ).toBeVisible();
  await expect(
    page.locator(".site-header nav a[aria-current='page']"),
  ).toHaveText("Property Owners");
  await expect(
    page.getByRole("heading", { name: "Services", exact: true }),
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
  await page.goto("/#owner/workspace");
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
test("developer property gate, free account, and pending inquiry", async ({
  page,
}) => {
  await page.goto("/#developer");
  await expect(page.locator(".property-card")).toHaveCount(5);
  await expect(page.getByText("Catalog access", { exact: false })).toHaveCount(
    0,
  );
  await expect(
    page.getByText("Property criteria", { exact: false }),
  ).toHaveCount(0);
  await page
    .getByRole("link", { name: "View 9 Summer Street", exact: true })
    .click();
  await expect(page).toHaveURL(/#account\/developer\/wireless\/summer$/);
  await expect(
    page.getByRole("heading", { name: "Create a Free Account", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".property-detail")).toHaveCount(0);
  await page.getByLabel("Name", { exact: true }).fill("Demo Developer");
  await page
    .getByLabel("Email", { exact: true })
    .fill("developer@example.test");
  await page.getByLabel("Users on your team").fill("3");
  await page
    .getByRole("button", { name: "Create Free Account", exact: true })
    .click();
  await expect(page).toHaveURL(/#developer\/wireless\/summer$/);
  await expect(page.locator(".property-detail")).toContainText(
    "9 Summer Street",
  );
  await page.reload();
  await expect(
    page.getByText("Welcome, Demo Developer.", { exact: false }),
  ).toBeVisible();
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
  await page.reload();
  await expect(page.locator(".pending-row")).toHaveCount(2);
});

test("developer login returns to chosen property and direct links stay gated", async ({
  page,
}) => {
  await page.goto("/#developer/battery/battery-office");
  await expect(
    page.getByRole("heading", { name: "Create a Free Account", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Name", { exact: true }).fill("Battery Developer");
  await page.getByLabel("Email", { exact: true }).fill("battery@example.test");
  await page
    .getByRole("button", { name: "Create Free Account", exact: true })
    .click();
  await expect(page.locator(".property-detail")).toContainText(
    "16 Technology Drive",
  );
  await page
    .getByRole("button", { name: "Log out of demo", exact: true })
    .click();
  await page
    .getByRole("button", { name: "View 210 River Street on map", exact: true })
    .click();
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await page.getByLabel("Email", { exact: true }).fill("unknown@example.test");
  await page
    .getByRole("button", { name: "Log in to demo", exact: true })
    .click();
  await expect(page.locator(".account-page").getByRole("alert")).toContainText(
    "No demo account",
  );
  await page.getByLabel("Email", { exact: true }).fill("battery@example.test");
  await page
    .getByRole("button", { name: "Log in to demo", exact: true })
    .click();
  await expect(page.locator(".property-detail")).toContainText(
    "210 River Street",
  );
  await page
    .getByRole("link", { name: "Browse properties", exact: false })
    .click();
  await page.getByRole("button", { name: "List", exact: true }).click();
  await expect(page.locator(".property-card.horizontal")).toHaveCount(5);
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

test("developer types switch CRE catalogs and map layers", async ({ page }) => {
  await page.goto("/#developer");
  const selector = page.getByLabel("Infrastructure Developer Type", {
    exact: true,
  });
  await expect(selector.locator("option")).toHaveText([
    "Wireless",
    "Solar",
    "Battery Energy Storage Systems",
    "Outdoor Advertising",
  ]);
  const configurations = [
    {
      type: "wireless",
      layers: [
        "FCC Database",
        "Proprietary Cell Site Structures",
        "Deadzone Complaints",
      ],
      address: "123 Main Street",
    },
    {
      type: "solar",
      layers: ["Existing Solar Deployments"],
      address: "14 Sunfield Avenue",
    },
    {
      type: "battery",
      layers: ["Existing BESS Deployments"],
      address: "210 River Street",
    },
    {
      type: "advertising",
      layers: ["Existing billboard locations"],
      address: "18 Avenue Square",
    },
  ];
  for (const config of configurations) {
    await selector.selectOption(config.type);
    await expect(page.locator(".property-card")).toHaveCount(5);
    for (const building of [
      "Multifamily building",
      "Office building",
      "Mixed-use building",
      "Warehouse",
    ]) {
      await expect(
        page.locator(".property-card").filter({ hasText: building }),
      ).toHaveCount(building === "Warehouse" ? 2 : 1);
    }
    await expect(page.locator(".property-card").first()).toContainText(
      config.address,
    );
    const layerPanel = page.locator(".developer-map-layers");
    await expect(layerPanel.getByRole("checkbox")).toHaveCount(
      config.layers.length,
    );
    await expect(page.locator(".infrastructure-marker")).toHaveCount(
      config.layers.length * 3,
    );
    for (const layer of config.layers)
      await expect(
        layerPanel.getByRole("checkbox", { name: layer, exact: true }),
      ).toBeChecked();
    const toggle = layerPanel.getByRole("checkbox", {
      name: config.layers[0],
      exact: true,
    });
    await toggle.uncheck();
    await expect(page.locator(".infrastructure-marker")).toHaveCount(
      (config.layers.length - 1) * 3,
    );
    await expect(page.locator(".property-card")).toHaveCount(5);
    await toggle.check();
    await page
      .getByRole("button", {
        name: `View ${config.address} on map`,
        exact: true,
      })
      .click();
    await expect(page).toHaveURL(
      new RegExp(`#account/developer/${config.type}/`),
    );
    await expect(
      page.getByRole("heading", { name: "Create a Free Account", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Log in", exact: true }),
    ).toBeVisible();
    await page.goBack();
    await expect(selector).toHaveValue(config.type);
  }
  await selector.selectOption("wireless");
  await expect(page.locator(".developer-property-pin")).toHaveCount(5);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: "test-results/developer-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await selector.selectOption("battery");
  await expect(selector).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await expect(
    page
      .locator(".developer-map-layers")
      .getByRole("checkbox", { name: "Existing BESS Deployments" }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/developer-mobile.png",
    fullPage: true,
  });
});

test("save complimentary preview through free owner signup without changing scores", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByLabel("Enter your property address")
    .fill("25 Commerce Avenue");
  await page
    .getByRole("button", { name: "Explore Property", exact: true })
    .click();
  const scores = await page
    .locator(".feasibility-dial strong")
    .allTextContents();
  await page
    .getByRole("link", {
      name: "Save Complimentary Easement Marketing Feasibility Analysis",
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(/#account\/owner\/save$/);
  await page.getByLabel("Name", { exact: true }).fill("Property Owner");
  await page.getByLabel("Email", { exact: true }).fill("owner@example.test");
  await page
    .getByRole("button", { name: "Create Free Account", exact: true })
    .click();
  await expect(page).toHaveURL(/#owner\/analyses$/);
  await expect(page.locator(".saved-analysis h3")).toHaveText(
    "25 Commerce Avenue",
  );
  await expect(page.locator(".saved-analysis dd")).toHaveText(scores);
  await page.reload();
  await expect(page.locator(".saved-analysis dd")).toHaveText(scores);
  await page.getByRole("link", { name: "Explore", exact: true }).click();
  await expect(page.locator(".feasibility-dial strong")).toHaveText(scores);
  await page
    .getByRole("link", {
      name: "Save Complimentary Easement Marketing Feasibility Analysis",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await page
    .getByRole("button", { name: "Log in to demo", exact: true })
    .click();
  await expect(page.locator(".saved-analysis")).toHaveCount(1);
  await page
    .getByLabel("Property addresses · one per line")
    .fill("14 Sunfield Avenue\n82 Market Street\n14 Sunfield Avenue");
  await page
    .getByRole("button", { name: "Preview portfolio feasibility", exact: true })
    .click();
  await expect(page.locator(".saved-analysis")).toHaveCount(3);
  await page.screenshot({
    path: "test-results/owner-saved-analyses.png",
    fullPage: true,
  });
});

test("Property Owners service prices, plan selection, and mobile layout", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: "Property Owners", exact: true })
    .click();
  await expect(page.locator(".owner-plan-grid .card")).toHaveCount(4);
  const plans = page.locator(".owner-plan-grid .card");
  await expect(plans.nth(0)).toContainText("entire portfolio");
  await expect(plans.nth(1)).toContainText("$499/year");
  await expect(plans.nth(1)).toContainText("One property marketed");
  await expect(plans.nth(2)).toContainText("2–9 properties marketed");
  await expect(plans.nth(2)).toContainText(
    "+ $99/year for every additional property",
  );
  await expect(plans.nth(3)).toContainText(
    "+ $49/year for every additional property",
  );
  await expect(plans.nth(3)).toContainText("Recommended");
  await page.screenshot({
    path: "test-results/owner-services-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({
    path: "test-results/owner-services-mobile.png",
    fullPage: true,
  });
  await page
    .getByRole("link", { name: "Choose Mid-Market", exact: true })
    .click();
  await expect(page).toHaveURL(/#account\/owner\/mid-market$/);
  await expect(
    page.getByText("Selected service: Mid-Market.", { exact: false }),
  ).toBeVisible();
  await page.getByLabel("Name", { exact: true }).fill("Portfolio Owner");
  await page
    .getByLabel("Email", { exact: true })
    .fill("portfolio@example.test");
  await page
    .getByRole("button", { name: "Create Free Account", exact: true })
    .click();
  await expect(page).toHaveURL(/#owner\/pricing$/);
  await expect(page.getByRole("status")).toContainText(
    "No subscription has been activated",
  );
});

test("legacy catalog restrictions no longer limit developer listings", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem(
      "easement-prototype-v1",
      JSON.stringify({
        criteria: { roof: "999999", fiber: "1", utilities: "1", grid: true },
        access: "friendly",
      }),
    ),
  );
  await page.goto("/#developer");
  await expect(page.locator(".property-card")).toHaveCount(5);
  await expect(page.locator(".developer-access, .criteria")).toHaveCount(0);
});
