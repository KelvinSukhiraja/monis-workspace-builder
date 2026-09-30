import { test, expect } from "@playwright/test";

test("empty room → customized setup → persisted selection → demo rental request", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Good work. Great space." }),
  ).toBeVisible();
  await expect(page.getByText("Developed by Kelvin Sukhiraja")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Add a desk & chair" }),
  ).toBeDisabled();
  await expect(page.locator("canvas")).toBeVisible();
  await page.screenshot({
    path: "test-results/desktop-empty.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Select Standing Desk", exact: true })
    .click();
  await page.getByRole("tab", { name: "Chairs", exact: true }).click();
  await page
    .getByRole("button", { name: "Select Ergo Chair", exact: true })
    .click();
  await page.getByRole("tab", { name: "Extras", exact: true }).click();
  await page
    .getByRole("button", { name: "Select A Little Green", exact: true })
    .click();
  await expect(page.locator(".rental-total")).toContainText("Rp 300k");
  await page.getByRole("button", { name: "Load Founder template" }).click();
  await expect(page.locator(".rental-total")).toContainText("Rp 615k");
  await expect(page.locator(".selection-list li")).toHaveCount(8);
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(page.locator(".selection-list li")).toHaveCount(3);
  await page.getByRole("button", { name: "Load Founder template" }).click();
  await page.reload();
  await expect(page.locator(".selection-list li")).toHaveCount(8);
  await expect(
    page.getByRole("button", { name: "Load Founder template" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Monthly", exact: true }).click();
  await expect(page.locator(".rental-total")).toContainText("Rp 2,091k");
  await page.getByRole("button", { name: "Weekly", exact: true }).click();
  await page.screenshot({
    path: "test-results/desktop-founder.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Review setup", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".checkout-items li")).toHaveCount(8);
  await expect(page.locator(".checkout-total")).toContainText("Rp 615.000");
  await page.screenshot({ path: "test-results/checkout.png", fullPage: true });
  await page
    .getByRole("button", { name: "Continue to rental request" })
    .click();
  await page.getByLabel("Your name", { exact: true }).fill("Alex Test");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("alex@example.com");
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  await page
    .getByLabel("Preferred delivery date", { exact: true })
    .fill(nextWeek);
  await page
    .getByRole("combobox", { name: "Where in Bali?", exact: true })
    .selectOption("Canggu");
  await page.getByRole("button", { name: "Preview rental request" }).click();
  await expect(
    page.getByRole("heading", { name: "Your space. All imagined." }),
  ).toBeVisible();
  await expect(
    page.getByText("Nothing has been sent, booked, or charged.", {
      exact: false,
    }),
  ).toBeVisible();
  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain(
    "alex@example.com",
  );
  await page.getByRole("button", { name: "Back to my space" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect(errors).toEqual([]);
});

for (const mode of ["unavailable", "throws"] as const) {
  test(`configuration remains usable when WebGL ${mode}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript((failure) => {
      const original = HTMLCanvasElement.prototype.getContext;
      Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
        value: function (contextType: string, ...args: unknown[]) {
          if (contextType === "webgl2") {
            if (failure === "throws") throw new Error("WebGL is blocked");
            return null;
          }
          return Reflect.apply(original, this, [contextType, ...args]);
        },
      });
    }, mode);
    await page.goto("/");
    await expect(page.locator(".scene-fallback")).toBeVisible();
    await page
      .getByRole("button", { name: "Load Essentials template" })
      .click();
    await expect(page.locator(".scene-fallback figure")).toHaveCount(2);
    await expect(page.locator(".rental-total")).toContainText("Rp 275k");
    await page
      .getByRole("button", { name: "Review setup", exact: true })
      .click();
    await expect(page.locator(".checkout-items li")).toHaveCount(2);
    expect(errors).toEqual([]);
  });
}

test("blocked storage does not prevent customization or checkout", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, "getItem", {
      value: () => {
        throw new DOMException("Storage blocked", "SecurityError");
      },
    });
    Object.defineProperty(Storage.prototype, "setItem", {
      value: () => {
        throw new DOMException("Storage blocked", "SecurityError");
      },
    });
  });
  await page.goto("/");
  await expect(
    page.getByText("Your browser couldn’t save this setup.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Load Essentials template" }).click();
  await expect(page.locator(".rental-total")).toContainText("Rp 275k");
  await page.getByRole("button", { name: "Review setup", exact: true }).click();
  await expect(page.locator(".checkout-total")).toContainText("Rp 275.000");
});

test("mobile catalog, camera controls, and checkout fit the viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Load Studio template" }).click();
  await expect(page.locator(".selection-list li")).toHaveCount(8);
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await expect(page.locator(".view-controls")).toContainText("110%");
  await page.getByRole("button", { name: "Reset camera", exact: true }).click();
  await expect(page.locator(".view-controls")).toContainText("100%");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/mobile-studio.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Review setup", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("button", { name: "Monthly", exact: true })
    .last()
    .click();
  await expect(page.locator(".checkout-total")).toContainText("Rp 2.975.000");
  await page.screenshot({
    path: "test-results/mobile-checkout.png",
    fullPage: true,
  });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("keyboard categories and review removal preserve valid totals", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Desks", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Chairs", exact: true }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Load Essentials template" }).click();
  await page.getByRole("button", { name: "Review setup", exact: true }).click();
  await page
    .getByRole("button", {
      name: "Remove Standing Desk from review",
      exact: true,
    })
    .click();
  await expect(page.locator(".checkout-total")).toContainText("Rp 125.000");
  await expect(
    page.getByRole("button", { name: "Continue to rental request" }),
  ).toBeDisabled();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Add a desk & chair" }),
  ).toBeDisabled();
});
