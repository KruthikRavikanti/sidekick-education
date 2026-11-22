import { defineConfig } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";

// Explicitly operates on the locally saved, genuinely generated benchmark.
// It neither calls a model nor seeds/replaces the application database.
const enabled = process.env.SIDEKICK_RUN_FRACTION_BENCHMARK === "true";
const config = enabled ? JSON.parse(readFileSync(process.env.SIDEKICK_BENCHMARK_CONFIG!, "utf8")) : null;
if (config && (!String(config.databaseUrl).startsWith("sqlite:///")
    || !path.basename(String(config.databaseUrl)).startsWith("sidekick-benchmark-"))) {
  throw new Error("The benchmark requires its isolated synthetic verification database.");
}
if (config) process.env.SIDEKICK_BENCHMARK_BROWSER_STATE = config.browserState;

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "activity-program-v2-fraction-benchmark.spec.ts",
  workers: 1,
  timeout: 120_000,
  expect: { timeout: 15_000 },
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    browserName: "chromium",
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    storageState: process.env.SIDEKICK_BENCHMARK_BROWSER_STATE,
    screenshot: "only-on-failure",
  },
  webServer: config ? [{
    command: "backend/.venv/bin/python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --no-access-log",
    url: "http://127.0.0.1:8000/api/health",
    env: { DATABASE_URL: config.databaseUrl, SIDEKICK_PRIVATE_UPLOAD_DIR: config.privateUploadDirectory,
      APP_ENV: "test", PASSWORD_POLICY: "dev", COOKIE_SECURE: "false",
      TRUSTED_ORIGINS: "http://localhost:3000", SIDEKICK_ACTIVITY_V2_PREVIEW: "true", SIDEKICK_FIXTURE_MODE: "false" },
    reuseExistingServer: false,
  }, {
    command: "npm run dev -- --port 3000",
    url: "http://localhost:3000",
    env: { BACKEND_URL: "http://127.0.0.1:8000" },
    reuseExistingServer: false,
  }] : undefined,
});
