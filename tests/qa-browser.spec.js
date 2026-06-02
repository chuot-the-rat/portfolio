import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:4173";
const MOJIBAKE_RE = /(Ã|â€|Â|�)/;
const HOME_PRIMARY_EMAIL = ".hs-cta--primary[href='mailto:leanale003@gmail.com']";

async function expectCleanRecruiterRoute(page, path, checks) {
  await page.goto(`${BASE_URL}${path}`, { waitUntil: "domcontentloaded" });

  for (const check of checks) {
    if (check.type === "role") {
      await expect(page.getByRole(check.role, { name: check.name })).toBeVisible();
      continue;
    }

    if (check.type === "locator") {
      await expect(page.locator(check.selector)).toBeVisible();
      continue;
    }

    await expect(page.locator(check.selector)).toBeVisible();
    if (check.text) {
      await expect(page.locator(check.selector)).toContainText(check.text);
    }
  }

  await expect(page).not.toHaveTitle(MOJIBAKE_RE);
  const title = await page.title();
  expect(title.length).toBeGreaterThan(0);

  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toMatch(MOJIBAKE_RE);
}

test.describe("Desktop QA", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("home nav/work list/footer and primary contact CTA", async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await expect(page.locator(".nav-container")).toBeVisible();
    await expect(page.locator("#home-work-list")).toBeVisible();
    await expect(page.locator(HOME_PRIMARY_EMAIL)).toBeVisible();
    await expect(page.locator(".footer-nav")).toBeVisible();
  });

  test("case study trust modules are present on flagship pages", async ({ page }) => {
    await page.goto(`${BASE_URL}/case-studies/inklink`, { waitUntil: "domcontentloaded" });
    await expect(page.locator(".project-hero")).toBeVisible();
    await expect(page.locator(".project-meta-bar")).toBeVisible();
    await expect(page.locator(".project-impact-snapshot")).toBeVisible();
    await expect(page.locator(".project-credibility")).toBeVisible();
    await expect(page.locator(".project-content")).toBeVisible();
  });

  test("keyboard focus traversal reaches key controls", async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.outerHTML || "");
    expect(focused.length).toBeGreaterThan(0);
  });

  test("recruiter-facing routes show clean copy", async ({ page }) => {
    await expectCleanRecruiterRoute(page, "/", [
      { type: "locator", selector: HOME_PRIMARY_EMAIL },
      { selector: ".footer-tagline", text: "Designed and developed with care in Vancouver, BC" },
    ]);

    await expectCleanRecruiterRoute(page, "/about", [
      { selector: ".about-hero-status", text: "Available in Vancouver, BC" },
      { selector: ".about-resume-btn--primary", text: "Open resume in new tab" },
    ]);

    await expectCleanRecruiterRoute(page, "/projects", [
      { selector: ".projects-conversion-text", text: "Hiring for product design?" },
      { type: "role", role: "link", name: /^Resume$/i },
    ]);
  });
});

test.describe("Mobile QA", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("home work list and CTA are readable on mobile", async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#home-work-list")).toBeVisible();
    await expect(page.locator(HOME_PRIMARY_EMAIL)).toBeVisible();
  });

  test("about contact/resume handoff blocks are present", async ({ page }) => {
    await page.goto(`${BASE_URL}/about`, { waitUntil: "domcontentloaded" });
    await expect(page.locator(".about-connect")).toBeVisible();
    await expect(page.locator("#about-resume, #resume.about-resume")).toBeVisible();
    await expect(page.locator(".about-email-link")).toBeVisible();
    await expect(page.locator(".about-resume-btn--primary")).toBeVisible();
    await expect(page.locator(".about-resume-btn--ghost")).toBeVisible();
    await expect(page).toHaveTitle(/About/i);
  });
});

test("reduced-motion mode keeps core content available", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${BASE_URL}/case-studies/prolog`, { waitUntil: "domcontentloaded" });
  await expect(page.locator(".project-hero")).toBeVisible();
  await expect(page.locator(".project-content")).toBeVisible();
  await page.goto(`${BASE_URL}/about`, { waitUntil: "domcontentloaded" });
  await expect(page.locator(".about-connect")).toBeVisible();
  await expect(page.locator(".about-resume-actions")).toBeVisible();
});
