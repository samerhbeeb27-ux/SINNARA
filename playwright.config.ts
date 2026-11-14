import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 2,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    headless: true,
    viewport: { width: 1440, height: 1000 },
    trace: "off",
  },
  webServer: {
    command: "npm run serve",
    url: "http://127.0.0.1:4173/en/",
    reuseExistingServer: false,
    timeout: 30000,
  },
});
