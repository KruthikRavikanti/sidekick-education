import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import { expect, test, type Page } from "@playwright/test";
import type { ActivityAttemptDetail, ActivitySession } from "../../lib/activity-types";
import { createFamily, mutate, PIN } from "./helpers";

const execute = promisify(execFile);

async function submit(page: Page, session: ActivitySession) {
  const saved = page.waitForResponse(response => response.url().endsWith(`/api/activities/kid/sessions/${session.id}/submit`) && response.request().method() === "POST");
  await page.getByRole("button", { name: session.currentScene!.phase === "independent" ? "Save my answer" : "Check it", exact: true }).click();
  const response = await saved;
  expect(response.status()).toBe(200);
  return await response.json() as ActivitySession;
}

async function next(page: Page, session: ActivitySession) {
  const advanced = page.waitForResponse(response => response.url().endsWith(`/api/activities/kid/sessions/${session.id}/next`) && response.request().method() === "POST");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  const response = await advanced;
  expect(response.status()).toBe(200);
  return await response.json() as ActivitySession;
}

async function design(page: Page, rows: number, columns: number) {
  for (let index = 1; index < rows; index++) await page.getByRole("button", { name: "Add one row", exact: true }).click();
  for (let index = 1; index < columns; index++) await page.getByRole("button", { name: "Add one column", exact: true }).click();
}

test("the same upload skill composes distinct actions, carries actual work, resumes, and reaches exact parent history", async ({ page, context }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const family = await createFamily(context, "3");
  const sessions: ActivitySession[] = [];
  for (const variant of ["tile", "design"] as const) {
    await page.goto("/kid/homework");
    await page.getByLabel("Choose work image", { exact: true }).setInputFiles(path.join(process.cwd(), "public/samples/activity-composed-area-work.png"));
    const extracted = page.waitForResponse(response => response.url().endsWith("/api/extract") && response.request().method() === "POST");
    await page.getByRole("button", { name: "Read my work", exact: true }).click();
    const upload = await extracted;
    expect(upload.status()).toBe(200);
    const uploadId = upload.headers()["x-sidekick-upload-id"];
    await execute("backend/.venv/bin/python", ["tests/e2e/composed_activity_fixture.py", process.env.SIDEKICK_E2E_DATABASE_URL!, family.kid.id, uploadId]);
    const started = page.waitForResponse(response => response.url().endsWith("/api/activities/kid/start") && response.request().method() === "POST");
    await page.getByRole("button", { name: "Try an activity", exact: true }).click();
    const response = await started;
    expect(response.status()).toBe(200);
    let session = await response.json() as ActivitySession;
    expect(session.targetSkill.id).toBe("3.MD.C.7-1");
    expect(session.origin).toBe("model_generated");
    expect(session.currentScene!.component).toBe("math_workspace");
    const board = page.getByRole("region", { name: "Rectangle area workspace", exact: true });
    await expect(board).toHaveAttribute("data-mode", variant === "tile" ? "area_tile" : "area_design");
    if (variant === "tile") {
      await page.getByRole("button", { name: "Place tile at row 1, column 1", exact: true }).click();
      session = await submit(page, session);
      expect(session.feedback!.correct).toBe(false);
      await page.getByRole("button", { name: "Try again", exact: true }).click();
      for (let y = 1; y <= 2; y++) for (let x = 1; x <= 3; x++) {
        if (x !== 1 || y !== 1) await page.getByRole("button", { name: `Place tile at row ${y}, column ${x}`, exact: true }).click();
      }
      await expect(board).toHaveAttribute("data-tiles-placed", "6");
    } else {
      // The composed placeholder is 3×4. This different valid design must be
      // what the server carries forward and assesses in the next scene.
      await design(page, 2, 6);
      await expect(board).toHaveAttribute("data-rows", "2");
      await expect(board).toHaveAttribute("data-columns", "6");
      await expect(page.getByLabel("Tile stock", { exact: true })).toHaveText("12 tiles used · 0 in stock");
    }
    session = await submit(page, session);
    expect(session.feedback!.correct).toBe(true);
    await page.reload();
    await expect(board).toHaveAttribute("data-tiles-placed", variant === "tile" ? "6" : "12");
    await expect(page.getByRole("button", { name: "Next", exact: true })).toBeVisible();
    session = await next(page, session);
    expect(session.currentScene!.component).toBe("math_workspace");
    if (session.currentScene!.component !== "math_workspace") throw new Error("Expected connected rectangle workspace");
    expect(session.currentScene!.params.mode).toBe("area_expression");
    expect(session.currentScene!.params.area).toEqual({ rows: 2, columns: variant === "tile" ? 3 : 6, targetArea: variant === "tile" ? 6 : 12 });
    await expect(page.getByRole("img", { name: variant === "tile" ? "2 rows of 3 unit squares" : "2 rows of 6 unit squares", exact: true })).toBeVisible();
    await page.getByLabel("Your area expression", { exact: true }).fill(variant === "tile" ? "2 × 3 = 6" : "2 × 6 = 12");
    session = await submit(page, session);
    expect(session.feedback!.correct).toBe(true);
    session = await next(page, session);
    await expect(page.getByRole("region", { name: "Learning tip", exact: true })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Show a hint", exact: true })).toHaveCount(0);
    if (variant === "tile") {
      expect(session.currentScene!.component).toBe("math_workspace");
      if (session.currentScene!.component !== "math_workspace") throw new Error("Expected fresh area expression");
      expect(session.currentScene!.params.mode).toBe("area_expression");
      expect(session.currentScene!.params.area).toEqual({ rows: 2, columns: 4, targetArea: null });
      await page.getByLabel("Your area expression", { exact: true }).fill("2 × 4 = 8");
    }
    else {
      await design(page, 3, 5);
      await expect(page.getByLabel("Tile stock", { exact: true })).toHaveCount(0);
      await expect(page.getByLabel("Available tile stock", { exact: true })).toHaveText("Available: 15 tiles.");
    }
    session = await submit(page, session);
    expect(session.status).toBe("completed");
    expect(session.finalResult!.correct).toBe(true);
    sessions.push(session);
    await expect(page.getByText("ACTIVITY COMPLETE", { exact: true })).toBeVisible();
    expect((await context.request.get(`/api/activities/parent/${family.kid.id}/sessions/${session.id}`)).status()).toBe(403);
  }
  expect(sessions[0].id).not.toBe(sessions[1].id);
  await mutate(context.request, "/api/session/picker");
  await page.goto("/profiles");
  await page.getByRole("button", { name: /Parent.*PIN protected/ }).click();
  await page.getByLabel("Parent PIN", { exact: true }).fill(PIN);
  await page.getByRole("button", { name: "Enter parent mode", exact: true }).click();
  await page.getByRole("button", { name: "Activities", exact: true }).click();
  const history = await (await context.request.get(`/api/activities/parent/${family.kid.id}/history`)).json();
  expect(history.activities).toHaveLength(2);
  expect(history.activities.every((activity: ActivitySession) => activity.finalResult!.correct)).toBe(true);
  for (const [index, session] of sessions.entries()) {
    const card = page.locator(".activity-history-card").filter({ has: page.getByRole("heading", { name: session.title, exact: true }) });
    await card.getByRole("button", { name: "View activity", exact: true }).click();
    const steps = card.getByRole("region", { name: "Saved activity steps", exact: true });
    await expect(steps).toBeVisible();
    await expect(steps.locator(".parent-attempt-step")).toHaveCount(3);
    await expect(steps).toContainText(index === 0 ? "2 × 3 = 6" : "2 × 6 = 12");
    await expect(steps.getByRole("img", { name: index === 0 ? "2 rows of 3 unit squares" : "2 rows of 6 unit squares", exact: true }).first()).toBeVisible();
    const detail = await (await context.request.get(`/api/activities/parent/${family.kid.id}/sessions/${session.id}`)).json() as ActivityAttemptDetail;
    expect(detail.scenes.map(scene => scene.responses.length)).toEqual(index === 0 ? [2, 1, 1] : [1, 1, 1]);
    if (index === 0) {
      const earlier = steps.locator(".parent-earlier-response");
      await earlier.getByText("View saved work for this try", { exact: true }).click();
      await expect(earlier.getByRole("region", { name: "Rectangle area workspace", exact: true })).toHaveAttribute("data-tiles-placed", "1");
      await expect(earlier.getByRole("button", { name: "Lift tile at row 1, column 1", exact: true })).toBeDisabled();
    }
    expect(detail.finalResult!.correct).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
