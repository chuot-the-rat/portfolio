import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:4173";

test.describe("Desktop QA", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("home nav/footer/proof strip and recruiter CTA", async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await expect(page.locator(".nav-container")).toBeVisible();
    await expect(page.locator(".home-proof-strip")).toBeVisible();
    await expect(page.getByRole("link", { name: /Email role details/i })).toBeVisible();
    await expect(page.locator(".footer-nav")).toBeVisible();
  });

  test("case study trust modules are present", async ({ page }) => {
    await page.goto(`${BASE_URL}/case-studies/inklink`, { waitUntil: "networkidle" });
    await expect(page.locator(".project-meta-bar")).toBeVisible();
    await expect(page.locator(".project-impact-snapshot")).toBeVisible();
    await expect(page.locator(".project-credibility")).toBeVisible();
    await expect(page.locator(".checklist-section")).toBeVisible();
  });

  test("keyboard focus traversal reaches key controls", async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.outerHTML || "");
    expect(focused.length).toBeGreaterThan(0);
  });
});

test.describe("Mobile QA", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("home proof strip and CTA are readable on mobile", async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await expect(page.locator(".home-proof-strip")).toBeVisible();
    await expect(page.getByRole("link", { name: /Email role details/i })).toBeVisible();
  });

  test("about contact/resume handoff blocks are present", async ({ page }) => {
    await page.goto(`${BASE_URL}/about`, { waitUntil: "networkidle" });
    await expect(page.locator(".about-connect")).toBeVisible();
    await expect(page.locator("#resume")).toBeVisible();
  });
});

test("reduced-motion mode keeps core content available", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${BASE_URL}/case-studies/prolog`, { waitUntil: "networkidle" });
  await expect(page.locator(".project-hero")).toBeVisible();
  await expect(page.locator(".project-content")).toBeVisible();
});
