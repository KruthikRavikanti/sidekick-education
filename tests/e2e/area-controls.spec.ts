/** Public-DTO rendering regressions; real composition, linked state and protected
 * assessment are verified separately through the upload/API flow. */
import { expect, test, type Page } from "@playwright/test";
import type { ActivityResponse, ActivityScene, ActivitySession } from "../../lib/activity-types";
import { createFamily } from "./helpers";

async function openBoard(page: Page, mode: "area_tile" | "area_design" | "area_expression", area: { rows: number; columns: number; targetArea: number | null }, response: ActivityResponse | null = null, phase: "guided" | "independent" = "independent") {
  const session: ActivitySession = {
    id: `area-control-${mode}`, title: "Rectangle controls", origin: "model_generated", subject: "math",
    targetSkill: { id: "3.MD.C.7-1", name: "Rectangle area", subject: "math" },
    status: "in_progress", sceneIndex: phase === "independent" ? 2 : 0, sceneCount: 3,
    currentScene: {
      id: "board", phase, prompt: "Complete the rectangle mission.", component: "math_workspace",
      params: { context: null, teachingText: phase === "guided" ? "Every square covers one square unit." : null,
        goal: mode === "area_design" ? `Build a rectangle using exactly ${area.targetArea} tiles.` : "Use your rectangle to finish the scene.", visual: null,
        mode, area, width: 12, height: 12, step: "1", origin: "0", unitLabel: "centimeter", objects: [], tokens: [] },
    } as ActivityScene,
    currentResponse: response, feedback: null, hint: null, canAdvance: false, finalResult: null,
  };
  const endpoint = `/api/activities/kid/sessions/${session.id}`;
  await page.route(`**${endpoint}`, route => route.fulfill({ json: session }));
  await page.route(`**${endpoint}/submit`, route => route.fulfill({ json: {
    ...session, status: "completed", currentScene: null,
    finalResult: { question: "Render-only rectangle check", response: "Saved board state", correct: true },
  } }));
  await page.goto(`/kid/activities/${session.id}`);
  await expect(page.getByRole("heading", { name: session.currentScene!.prompt, exact: true })).toBeVisible();
  await expect(page.getByRole("region", { name: "Learning tip", exact: true })).toHaveCount(phase === "guided" ? 1 : 0);
  return async () => {
    const saved = page.waitForRequest(request => request.url().endsWith(`${endpoint}/submit`) && request.method() === "POST");
    await page.getByRole("button", { name: phase === "guided" ? "Check it" : "Save my answer", exact: true }).click();
    const body = (await saved).postDataJSON();
    await expect(page.getByText("ACTIVITY COMPLETE", { exact: true })).toBeVisible();
    return body.response;
  };
}

test.beforeEach(async ({ context }) => { await createFamily(context, "3"); });

test("area tiling changes unit squares, supports lifting, and submits actual cells", async ({ page }) => {
  const save = await openBoard(page, "area_tile", { rows: 2, columns: 3, targetArea: 6 }, null, "guided");
  const board = page.getByRole("region", { name: "Rectangle area workspace", exact: true });
  await expect(board).toHaveAttribute("data-tiles-placed", "0");
  await expect(page.getByRole("button", { name: "Check it", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Place tile at row 1, column 1", exact: true }).press("Enter");
  await expect(page.getByLabel("Tiles placed", { exact: true })).toHaveText("1 tile placed");
  await page.getByRole("button", { name: "Lift tile at row 1, column 1", exact: true }).click();
  await expect(board).toHaveAttribute("data-tiles-placed", "0");
  const marks: { x: number; y: number }[] = [];
  for (let y = 0; y < 2; y++) for (let x = 0; x < 3; x++) {
    await page.getByRole("button", { name: `Place tile at row ${y + 1}, column ${x + 1}`, exact: true }).click();
    marks.push({ x, y });
  }
  await expect(board).toHaveAttribute("data-tiles-placed", "6");
  expect(await save()).toEqual({ marks, text: "" });
});

test("area design resizes the rectangle and linked tile stock with a different action", async ({ page }) => {
  const save = await openBoard(page, "area_design", { rows: 1, columns: 1, targetArea: 12 });
  const board = page.getByRole("region", { name: "Rectangle area workspace", exact: true });
  await expect(page.getByRole("button", { name: /Place tile/ })).toHaveCount(0);
  await page.getByRole("button", { name: "Add one row", exact: true }).click();
  await page.getByRole("button", { name: "Add one row", exact: true }).click();
  for (let index = 0; index < 3; index++) await page.getByRole("button", { name: "Add one column", exact: true }).click();
  await expect(board).toHaveAttribute("data-rows", "3");
  await expect(board).toHaveAttribute("data-columns", "4");
  await expect(board.locator(".area-cell-filled")).toHaveCount(12);
  await expect(page.getByLabel("Tile stock", { exact: true })).toHaveCount(0);
  await expect(page.getByLabel("Available tile stock", { exact: true })).toHaveText("Available: 12 tiles.");
  await expect(page.getByRole("region", { name: "Learning tip", exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await save()).toEqual({ marks: [{ x: 4, y: 3 }], text: "" });
});

test("area expression renders server-resolved rectangle without giving its answer", async ({ page }) => {
  const save = await openBoard(page, "area_expression", { rows: 3, columns: 4, targetArea: null });
  await expect(page.getByRole("img", { name: "3 rows of 4 unit squares", exact: true })).toBeVisible();
  await expect(page.getByLabel("Your area expression", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Tiles placed", { exact: true })).toHaveCount(0);
  await expect(page.getByLabel("Tile stock", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Save my answer", exact: true })).toBeDisabled();
  await page.getByLabel("Your area expression", { exact: true }).fill("3 × 4 = 12");
  expect(await save()).toEqual({ marks: [], text: "3 × 4 = 12" });
});

test("saved tile and rectangle states reopen with their exact visible work", async ({ page }) => {
  await openBoard(page, "area_tile", { rows: 2, columns: 2, targetArea: 4 }, { marks: [{ x: 1, y: 0 }], text: "" });
  await expect(page.getByRole("button", { name: "Lift tile at row 1, column 2", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: /Place tile/ })).toHaveCount(3);
  const save = await openBoard(page, "area_design", { rows: 1, columns: 1, targetArea: 12 }, { marks: [{ x: 4, y: 3 }], text: "" });
  await expect(page.getByRole("region", { name: "Rectangle area workspace", exact: true })).toHaveAttribute("data-tiles-placed", "12");
  expect(await save()).toEqual({ marks: [{ x: 4, y: 3 }], text: "" });
});
