import { test, expect } from "@playwright/test";

test("renders 118 elements and supports search, language and theme", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Chemistry|شیمی/);
  await expect(page.locator(".element-card")).toHaveCount(118);

  const search = page.getByRole("combobox", { name: "جستجو" });
  await search.fill("هیدروژن");
  await expect(page.getByRole("option")).toHaveCount(1);
  await search.press("ArrowDown");
  await search.press("Enter");
  await expect(search).toHaveValue("هیدروژن");

  await page.getByRole("button", { name: "English" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("combobox", { name: "Search" })).toBeVisible();

  const englishSearch = page.getByRole("combobox", { name: "Search" });
  await englishSearch.fill("Hydrogen");
  await expect(page.getByRole("option")).toHaveCount(1);
  await englishSearch.press("Enter");
  await expect(englishSearch).toHaveValue("Hydrogen");

  await page.getByRole("button", { name: "Dark mode" }).click();
  await expect(page.locator("html")).toHaveClass(/dark-mode/);
});

test("keeps the table readable on mobile and honors reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const scroll = page.locator(".periodic-table-scroll");
  expect(await scroll.evaluate((element) => element.scrollWidth > element.clientWidth)).toBeTruthy();

  const firstCard = page.locator(".element-card").first();
  await firstCard.click();
  await expect(firstCard).toHaveClass(/element-card--blink/);
  await expect(firstCard).toHaveCSS("animation-duration", "3s");
  await expect(firstCard).toHaveCSS("animation-name", "element-card-soft-blink");
  await page.waitForTimeout(3100);
  await expect(firstCard).not.toHaveClass(/element-card--blink/);
});
