import { defineConfig } from "@playwright/test";
import os from "node:os";
import path from "node:path";

process.env.SIDEKICK_E2E_DATABASE_URL ||= `sqlite:///${path.join(os.tmpdir(), `sidekick-e2e-${process.pid}-${Date.now()}.sqlite3`)}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  expect: { timeout: 15_000 },
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    browserName: "chromium",
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: [
    {
      command:
        "backend/.venv/bin/python -m backend.accounts migrate && backend/.venv/bin/python -m backend.gap seed-catalog && backend/.venv/bin/python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --no-access-log",
      url: "http://127.0.0.1:8000/api/health",
      env: {
        SIDEKICK_FIXTURE_MODE: "true",
        DATABASE_URL: process.env.SIDEKICK_E2E_DATABASE_URL,
        APP_ENV: "test",
        PASSWORD_POLICY: "dev",
        COOKIE_SECURE: "false",
        TRUSTED_ORIGINS: "http://localhost:3000",
      },
      reuseExistingServer: false,
      timeout: 30_000,
    },
    {
      command: "npm run dev -- --port 3000",
      url: "http://localhost:3000",
      env: { BACKEND_URL: "http://127.0.0.1:8000" },
      reuseExistingServer: false,
      timeout: 90_000,
    },
  ],
});
