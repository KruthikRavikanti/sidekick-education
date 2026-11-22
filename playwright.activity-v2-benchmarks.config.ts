import { defineConfig } from "@playwright/test";
import os from "node:os";
import path from "node:path";

// Separate ports, database, upload storage and Next cache keep the ordinary
// localhost:3000/8000 app untouched. This suite never calls a model provider.
process.env.SIDEKICK_E2E_DATABASE_URL ||= `sqlite:///${path.join(os.tmpdir(), `sidekick-e2e-benchmarks-${process.pid}-${Date.now()}.sqlite3`)}`;
const databaseUrl = process.env.SIDEKICK_E2E_DATABASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "activity-program-v2-benchmarks.spec.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: "list",
  outputDir: "test-results/benchmarks",
  use: {
    baseURL: "http://localhost:3300",
    browserName: "chromium",
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: [
    {
      command: "backend/.venv/bin/python -m backend.accounts migrate && backend/.venv/bin/python -m backend.gap seed-catalog && backend/.venv/bin/python -m backend.activities seed-library && backend/.venv/bin/python -m uvicorn activity_program_app:app --app-dir tests/e2e --host 127.0.0.1 --port 8300 --no-access-log",
      url: "http://127.0.0.1:8300/api/health",
      env: {
        DATABASE_URL: databaseUrl,
        SIDEKICK_PRIVATE_UPLOAD_DIR: `${databaseUrl.slice("sqlite:///".length)}.uploads`,
        SIDEKICK_FIXTURE_MODE: "true",
        SIDEKICK_ACTIVITY_V2_PREVIEW: "true",
        APP_ENV: "test",
        PASSWORD_POLICY: "dev",
        COOKIE_SECURE: "false",
        TRUSTED_ORIGINS: "http://localhost:3300",
      },
      reuseExistingServer: false,
      timeout: 30_000,
    },
    {
      command: "npm run dev -- --port 3300 --webpack",
      url: "http://localhost:3300",
      env: { BACKEND_URL: "http://127.0.0.1:8300", SIDEKICK_NEXT_DIST_DIR: "node_modules/.cache/sidekick-benchmark-e2e-next", SIDEKICK_NEXT_TSCONFIG: "tests/e2e/benchmarks.tsconfig.json" },
      reuseExistingServer: false,
      timeout: 90_000,
    },
  ],
});
