import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

const servers = Array.isArray(base.webServer) ? base.webServer : [base.webServer!];
export default defineConfig({
  ...base,
  testMatch: "activity-program-v2-composition.spec.ts",
  testIgnore: [],
  webServer: servers.map((server, index) => ({
    ...server,
    ...(index === 0 ? {
      command: server.command.replace(" && backend/.venv/bin/python -m backend.activities seed-library", "")
        .replace("uvicorn activity_app:app", "uvicorn activity_program_composition_app:app"),
      env: { ...server.env, SIDEKICK_ACTIVITY_V2_PREVIEW: "true" },
    } : {}),
  })),
});
