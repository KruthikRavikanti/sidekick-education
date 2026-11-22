import { defineConfig } from "@playwright/test";
import { readFileSync } from "node:fs";
import base from "./playwright.config";

if (process.env.SIDEKICK_RUN_GAME_LIVE !== "true" || !process.env.SIDEKICK_GAME_PRIVATE_CONFIG) {
  throw new Error("World verification requires explicit opt-in and an isolated private configuration.");
}
const proof = JSON.parse(readFileSync(process.env.SIDEKICK_GAME_PRIVATE_CONFIG, "utf8"));
process.env.SIDEKICK_E2E_DATABASE_URL = proof.databaseUrl;
const servers = Array.isArray(base.webServer) ? base.webServer : [base.webServer!];
export default defineConfig({
  ...base,
  testMatch: "activity-program-v2-game-live.spec.ts",
  testIgnore: [],
  timeout: 240_000,
  use: { ...base.use, storageState: proof.browserState, viewport: { width: 1280, height: 900 }, isMobile: false, hasTouch: false },
  webServer: servers.map((server, index) => ({
    ...server,
    ...(index === 0 ? {
      command: "backend/.venv/bin/python -m uvicorn activity_program_live_app:app --app-dir tests/e2e --host 127.0.0.1 --port 8000 --no-access-log",
      env: { ...server.env, DATABASE_URL: proof.databaseUrl, SIDEKICK_PRIVATE_UPLOAD_DIR: proof.privateUploadDirectory,
        SIDEKICK_ACTIVITY_V2_PREVIEW: "true", SIDEKICK_FIXTURE_MODE: "false", SIDEKICK_RUN_V2_LIVE: "true" },
    } : {}),
  })),
});
