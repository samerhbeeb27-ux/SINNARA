import { test, expect } from "@playwright/test";

test("welcome page provides both language routes", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("link", { name: "Continue in English" })).toHaveAttribute("href", "/en/");
  await expect(page.getByRole("link", { name: "تصفّح بالعربية" })).toHaveAttribute("href", "/ar/");
});

test("hosted preview serves headers, RTL HTML and static assets correctly", async ({ request }) => {
  test.skip(!process.env.PLAYWRIGHT_BASE_URL, "Cloudflare response headers are verified only on the hosted preview.");
  for (const locale of ["en", "ar"]) {
    const response = await request.get("/" + locale + "/");
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain('lang="' + locale + '"');
    expect(html).toContain('dir="' + (locale === "ar" ? "rtl" : "ltr") + '"');
    expect(response.headers()["x-robots-tag"]).toContain("noindex");
    expect(response.headers()["x-content-type-options"]).toBe("nosniff");
    expect(response.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
  }
  const icon = await request.get("/favicon.svg");
  expect(icon.status()).toBe(200);
  expect(icon.headers()["content-type"]).toContain("image/svg+xml");
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /");
  const missing = await request.get("/this-vacancy-route-does-not-exist/");
  expect(missing.status()).toBe(404);
});
