import { defineConfig } from "@playwright/test";

const hostedPreview = process.env.PLAYWRIGHT_BASE_URL;
if (hostedPreview && hostedPreview !== "https://sinnara.pages.dev") {
  throw new Error("Hosted checks must target the approved SINNARA prototype URL.");
}

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 2,
  reporter: "list",
  use: {
    baseURL: hostedPreview || "http://127.0.0.1:4173",
    headless: true,
    viewport: { width: 1440, height: 1000 },
    trace: "off",
  },
  webServer: hostedPreview ? undefined : {
    command: "npm run serve",
    url: "http://127.0.0.1:4173/en/",
    reuseExistingServer: false,
    timeout: 30000,
  },
});
