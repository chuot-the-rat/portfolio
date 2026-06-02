import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:4173";
const MOJIBAKE_RE = /(Ã|â€|Â|�)/;
const HOME_PRIMARY_EMAIL = ".hs-cta--primary[href='mailto:leanale003@gmail.com']";
const PASSBOOK_STORAGE_KEY = "leana_passbook_v1";

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

async function resetPassbookState(page) {
  await page.addInitScript((storageKey) => {
    if (window.sessionStorage.getItem("__passbook_reset_done")) return;
    window.localStorage.removeItem(storageKey);
    window.sessionStorage.removeItem("pb_anim_done");
    window.sessionStorage.setItem("__passbook_reset_done", "1");
  }, PASSBOOK_STORAGE_KEY);
}

async function tabToLocator(page, locator, maxTabs = 24) {
  for (let index = 0; index < maxTabs; index += 1) {
    await page.keyboard.press("Tab");
    const isFocused = await locator.evaluate(
      (element) => element === document.activeElement,
    ).catch(() => false);
    if (isFocused) return true;
  }
  return false;
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

  test("theme toggle is keyboard reachable and persists dark mode", async ({ page }) => {
    await page.addInitScript(() => {
      if (!window.sessionStorage.getItem("__theme_reset_done")) {
        window.localStorage.removeItem("theme");
        window.sessionStorage.setItem("__theme_reset_done", "1");
      }
    });
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });

    const themeToggle = page.locator(".nav-theme-btn");
    await expect(themeToggle).toBeVisible();
    await expect(themeToggle).toHaveAccessibleName(/switch to dark mode/i);
    await expect(themeToggle).toHaveAttribute("aria-pressed", "false");
    await expect.poll(
      async () => page.evaluate(() => document.documentElement.getAttribute("data-theme")),
    ).toBe("light");

    let reachedByKeyboard = false;
    for (let index = 0; index < 5; index += 1) {
      await page.keyboard.press("Tab");
      const isFocused = await themeToggle.evaluate(
        (element) => element === document.activeElement,
      );
      if (isFocused) {
        reachedByKeyboard = true;
        break;
      }
    }
    expect(reachedByKeyboard).toBe(true);

    await page.keyboard.press("Space");
    await expect(themeToggle).toHaveAttribute("aria-pressed", "true");
    await expect(themeToggle).toHaveAccessibleName(/switch to light mode/i);
    await expect.poll(
      async () => page.evaluate(() => document.documentElement.getAttribute("data-theme")),
    ).toBe("dark");
    await expect.poll(
      async () => page.evaluate(() => window.localStorage.getItem("theme")),
    ).toBe("dark");

    await page.reload({ waitUntil: "domcontentloaded" });
    const persistedToggle = page.locator(".nav-theme-btn");
    await expect(persistedToggle).toHaveAccessibleName(/switch to light mode/i);
    await expect(persistedToggle).toHaveAttribute("aria-pressed", "true");
    await expect.poll(
      async () => page.evaluate(() => document.documentElement.getAttribute("data-theme")),
    ).toBe("dark");
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

  test("passbook issuance rail parks on home and opens the drawer", async ({ page }) => {
    await resetPassbookState(page);
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });

    const printCard = page.locator(".pb-print-card");
    const embeddedDockButton = page.locator(".pb-peek-tab--embedded .pb-peek-tab__btn");

    await expect(printCard).toBeVisible();
    await expect(printCard).toContainText("Press to add passbook");
    await expect(printCard).toHaveAccessibleName(/printed pass ready\. press to add to rail\./i);
    await expect(embeddedDockButton).toHaveCount(0);

    const printCardReachedByKeyboard = await tabToLocator(page, printCard, 12);
    expect(printCardReachedByKeyboard).toBe(true);

    await page.keyboard.press("Space");

    await expect(embeddedDockButton).toBeVisible();
    await expect.poll(async () => page.locator(".pb-print-card").count()).toBe(0);
    await expect(embeddedDockButton).toHaveAccessibleName(/open archive passbook/i);
    await expect(embeddedDockButton).toContainText("0/5");

    await embeddedDockButton.focus();
    await page.keyboard.press("Enter");

    const drawer = page.getByRole("dialog", { name: /project passbook/i });
    await expect(drawer).toBeVisible();
    await expect(page.getByRole("button", { name: /close passbook/i })).toBeVisible();
    await expect(page.locator(".pb-drawer__progress-count")).toContainText("0 / 5");
  });

  test("passbook checkpoint stamping persists on flagship case studies", async ({ page }) => {
    await resetPassbookState(page);
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page.locator(".pb-print-card").click();
    await expect(page.locator(".pb-peek-tab--embedded .pb-peek-tab__btn")).toBeVisible();

    await page.goto(`${BASE_URL}/case-studies/inklink`, { waitUntil: "domcontentloaded" });

    const checkpointAction = page.locator(".pb-checkpoint__action");
    const stampedControl = page.locator(".pb-checkpoint__stamped");

    await expect(checkpointAction).toBeVisible();
    await expect(checkpointAction).toHaveAccessibleName(/collect stamp: seal registered/i);

    const checkpointReachedByKeyboard = await tabToLocator(page, checkpointAction, 120);
    expect(checkpointReachedByKeyboard).toBe(true);

    await page.keyboard.press("Enter");

    await expect(stampedControl).toBeVisible();
    await expect(stampedControl).toHaveAccessibleName(/stamped.*open passbook/i);
    await expect(checkpointAction).toHaveCount(0);

    await stampedControl.focus();
    await page.keyboard.press("Space");

    const drawer = page.getByRole("dialog", { name: /project passbook/i });
    await expect(drawer).toBeVisible();
    await expect(page.locator(".pb-drawer__progress-count")).toContainText("1 / 5");
    await expect(page.locator(".pb-route-row--stamped .pb-route-title")).toContainText("InkLink");

    const storedPassbook = await page.evaluate((storageKey) => {
      return JSON.parse(window.localStorage.getItem(storageKey) || "null");
    }, PASSBOOK_STORAGE_KEY);
    expect(storedPassbook?.parked).toBe(true);
    expect(storedPassbook?.stamps?.inklink?.stamped).toBe(true);

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/case-studies\/inklink$/);
    await expect(stampedControl).toBeVisible();
    await expect(checkpointAction).toHaveCount(0);
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

test("contact alias redirects to about contact section surface", async ({ page }) => {
  await page.goto(`${BASE_URL}/contact`, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator(".about-connect")).toBeVisible();
  await expect(page.locator(".about-email-link")).toBeVisible();
});

test("resume alias redirects to about resume section surface", async ({ page }) => {
  await page.goto(`${BASE_URL}/resume`, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator("#about-resume, #resume.about-resume")).toBeVisible();
  await expect(page.locator(".about-resume-btn--primary")).toBeVisible();
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
