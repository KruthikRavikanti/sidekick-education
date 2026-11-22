import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

// Uses the existing disposable database, real account security and API proxy.
// The preview flag is enabled only in this explicit development test command.
const servers = Array.isArray(base.webServer) ? base.webServer : [base.webServer!];

export default defineConfig({
  ...base,
  testMatch: "activity-program-v2.spec.ts",
  testIgnore: [],
  webServer: servers.map((server, index) => ({
    ...server,
    ...(index === 0 ? {
      command: server.command.replace("uvicorn activity_app:app", "uvicorn activity_program_app:app"),
      env: { ...server.env, SIDEKICK_ACTIVITY_V2_PREVIEW: "true" },
    } : {}),
  })),
});
