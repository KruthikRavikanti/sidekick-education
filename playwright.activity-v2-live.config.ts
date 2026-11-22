import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

if (process.env.SIDEKICK_RUN_V2_LIVE !== "true") {
  throw new Error("Live verification requires SIDEKICK_RUN_V2_LIVE=true and the existing configured provider.");
}
const servers = Array.isArray(base.webServer) ? base.webServer : [base.webServer!];
export default defineConfig({
  ...base,
  testMatch: "activity-program-v2-live.spec.ts",
  testIgnore: [],
  timeout: 1_800_000,
  webServer: servers.map((server, index) => ({
    ...server,
    ...(index === 0 ? {
      command: server.command.replace(" && backend/.venv/bin/python -m backend.activities seed-library", "")
        .replace("uvicorn activity_app:app", "uvicorn activity_program_live_app:app"),
      env: { ...server.env, SIDEKICK_ACTIVITY_V2_PREVIEW: "true", SIDEKICK_FIXTURE_MODE: "false", SIDEKICK_RUN_V2_LIVE: "true" },
    } : {}),
  })),
});
