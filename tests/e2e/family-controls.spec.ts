/** Render-only control tests. Real generation, grading, and parent ownership are
 * verified separately by catalog-activities.spec.ts. These tests supply only a
 * public session DTO behind the ordinary signed-in child player. */
import { expect, test, type Page } from "@playwright/test";
import type { ActivityScene, ActivitySession, ActivityVisual } from "../../lib/activity-types";
import { createFamily } from "./helpers";

const material = { context: null, teachingText: null, goal: "Use the board to complete this scene.", visual: null };

async function openControl(page: Page, id: string, component: ActivityScene["component"], params: object) {
  const session: ActivitySession = {
    id: `control-${id}`, title: "Control rendering check", origin: "model_generated",
    subject: "math", targetSkill: { id: "1.NBT.B.2-1", name: "Control rendering check", subject: "math" },
    status: "in_progress", sceneIndex: 2, sceneCount: 3,
    currentScene: { id: "fresh", phase: "independent", prompt: "Complete the new board.", component, params } as ActivityScene,
    currentResponse: null, feedback: null, hint: null, canAdvance: false, finalResult: null,
  };
  const endpoint = `/api/activities/kid/sessions/${session.id}`;
  await page.route(`**${endpoint}`, route => route.fulfill({ json: session }));
  await page.route(`**${endpoint}/submit`, route => route.fulfill({ json: {
    ...session, status: "completed", currentScene: null,
    finalResult: { question: "Render-only fixture", response: "Control state saved", correct: true },
  } }));
  await page.goto(`/kid/activities/${session.id}`);
  await expect(page.getByRole("heading", { name: "Complete the new board.", exact: true })).toBeVisible();
  await expect(page.getByRole("region", { name: "Learning tip", exact: true })).toHaveCount(0);
  return async () => {
    const request = page.waitForRequest(value => value.url().endsWith(`${endpoint}/submit`) && value.method() === "POST");
    await page.getByRole("button", { name: "Save my answer", exact: true }).click();
    const body = (await request).postDataJSON();
    await expect(page.getByText("ACTIVITY COMPLETE", { exact: true })).toBeVisible();
    return body.response;
  };
}

function workspace(mode: string, extras: object = {}) {
  return { ...material, mode, width: 12, height: 12, step: "1", origin: "0", unitLabel: "units", objects: [], tokens: [], ...extras };
}

test.beforeEach(async ({ context }) => { await createFamily(context); });

test("sort and connect actually move pieces and submit their target bindings", async ({ page }) => {
  const save = await openControl(page, "sort", "sort_connect", { ...material, mode: "connect",
    pieces: [{ id: "sun", text: "sun" }, { id: "map", text: "map" }],
    targets: [{ id: "s", label: "Starts with /s/" }, { id: "m", label: "Starts with /m/" }],
  });
  await page.getByRole("button", { name: "Choose piece sun", exact: true }).press("Enter");
  await page.getByRole("button", { name: "Place in Starts with /s/", exact: true }).click();
  await expect(page.getByRole("region", { name: "Starts with /s/", exact: true })).toContainText("sun");
  await expect(page.getByRole("button", { name: "Save my answer", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Choose piece map", exact: true }).click();
  await page.getByRole("button", { name: "Place in Starts with /m/", exact: true }).click();
  expect(await save()).toEqual({ placements: [{ pieceId: "sun", targetId: "s" }, { pieceId: "map", targetId: "m" }] });
});

test("clock reading shows an actual source face and hour/minute actions submit canonical time", async ({ page }) => {
  const save = await openControl(page, "clock", "math_workspace", workspace("clock", {
    objects: [{ id: "source", label: "Clock to read", x: 0, y: 0, width: 1, height: 1, shape: "text", value: "210" }],
  }));
  await expect(page.getByRole("img", { name: "Clock to read", exact: true })).toBeVisible();
  const face = page.getByRole("group", { name: "Clock face", exact: true });
  await expect(face.locator(".clock-hour-hand")).toHaveCount(0);
  await page.getByRole("button", { name: "Move hour hand to 3", exact: true }).click();
  await page.getByRole("radio", { name: "Minute hand", exact: true }).check();
  await page.getByRole("button", { name: "Move minute hand to 6", exact: true }).click();
  await page.getByRole("button", { name: "Minute forward", exact: true }).click();
  await expect(face.locator(".clock-hour-hand")).toHaveCount(1);
  await expect(face.locator(".clock-minute-hand")).toHaveCount(1);
  await page.getByLabel("Your math or measurement", { exact: true }).fill("3:31");
  expect(await save()).toEqual({ marks: [{ x: 3, y: 31 }], text: "3:31" });
});

test("the protractor keeps the given angle and moves a separate ray", async ({ page }) => {
  const save = await openControl(page, "angle", "math_workspace", workspace("angle", {
    objects: [{ id: "given", label: "Blue angle", x: 0, y: 0, width: 1, height: 1, shape: "line", value: "60" }],
  }));
  const fixed = page.locator(".angle-given-ray").last();
  const fixedEnd = await fixed.getAttribute("x2");
  const ray = page.locator(".angle-ray");
  const initial = await ray.getAttribute("x2");
  const slider = page.getByRole("slider", { name: "Angle ray", exact: true });
  await slider.focus();
  await slider.press("End");
  await slider.press("ArrowLeft");
  await expect(slider).toHaveValue("179");
  await expect(ray).not.toHaveAttribute("x2", initial!);
  await expect(fixed).toHaveAttribute("x2", fixedEnd!);
  expect(await save()).toEqual({ marks: [{ x: 179, y: 0 }], text: "" });
});

test("balance counterweights change the tilt and preserve the fixed load", async ({ page }) => {
  const save = await openControl(page, "balance", "math_workspace", workspace("balance", {
    width: 10, height: 2, unitLabel: "grams",
    objects: [{ id: "load", label: "Parcel", x: 0, y: 0, width: 1, height: 1, shape: "rect", value: "5" }],
  }));
  const beam = page.locator(".balance-beam");
  const initial = await beam.getAttribute("transform");
  const slider = page.getByRole("slider", { name: "Counterweight amount", exact: true });
  await slider.focus();
  await slider.press("Home");
  for (let index = 0; index < 5; index++) await slider.press("ArrowRight");
  await expect(beam).not.toHaveAttribute("transform", initial!);
  await expect(beam).toHaveAttribute("transform", "rotate(0,120,55)");
  await expect(page.locator(".balance-load")).toHaveCount(1);
  await expect(page.locator(".measurement-value")).toHaveText("5 grams");
  expect(await save()).toEqual({ marks: [{ x: 5, y: 0 }], text: "" });
});

test("graduated vessel fill changes physically and keeps fraction notation", async ({ page }) => {
  const save = await openControl(page, "vessel", "math_workspace", workspace("vessel", {
    width: 8, height: 2, step: "1/4", unitLabel: "cups",
    objects: [{ id: "sample", label: "Water", x: 0, y: 0, width: 1, height: 1, shape: "rect", value: "1" }],
  }));
  const liquid = page.locator(".vessel-liquid");
  await expect(liquid).toHaveAttribute("height", "0");
  const slider = page.getByRole("slider", { name: "Vessel fill level", exact: true });
  await slider.focus();
  await slider.press("Home");
  for (let index = 0; index < 3; index++) await slider.press("ArrowRight");
  await expect(liquid).toHaveAttribute("height", "63.75");
  await expect(page.locator(".measurement-value")).toHaveText("3/4 cups");
  expect(await save()).toEqual({ marks: [{ x: 3, y: 0 }], text: "" });
});

test("coin identification uses official local faces without naming the answers", async ({ page }) => {
  const visual: ActivityVisual = { kind: "coins", title: "Coin tray", author: null, caption: null, items: [
    { id: "a", kind: "penny", label: "Coin A", x: 10, y: 15, width: 30, height: 30, color: "brown" },
    { id: "b", kind: "quarter", label: "quarter", x: 55, y: 15, width: 35, height: 35, color: "gray" },
  ] };
  await openControl(page, "coins", "text_editor", { ...material, visual, mode: "compose", initialText: "", minLength: 1, maxLength: 500, minWords: 0, wordBank: [] });
  const illustration = page.getByRole("figure", { name: "Coin tray", exact: true });
  await expect(illustration.locator("image").first()).toHaveAttribute("href", "/activities/coins/penny.jpg");
  await expect(illustration.locator("image").last()).toHaveAttribute("href", "/activities/coins/quarter.jpg");
  await expect(illustration).not.toContainText(/penny|quarter/);
  await expect(page.getByRole("img", { name: "Coin picture 1", exact: true })).toBeVisible();
  expect((await page.request.get("/activities/coins/penny.jpg")).status()).toBe(200);
  expect((await page.request.get("/activities/coins/quarter.jpg")).status()).toBe(200);
});

test("written analysis can retain an actual chart with axes, labels, and bars", async ({ page }) => {
  const visual: ActivityVisual = { kind: "chart", title: "Garden growth", author: null, caption: "Height in centimeters", items: [
    { id: "x", kind: "line", label: "Days", x: 10, y: 80, width: 75, height: 0, color: "gray" },
    { id: "y", kind: "line", label: "Height", x: 10, y: 10, width: 0, height: 70, color: "gray" },
    { id: "one", kind: "rect", label: "Day 1", x: 25, y: 60, width: 15, height: 20, color: "green" },
    { id: "two", kind: "rect", label: "Day 2", x: 55, y: 40, width: 15, height: 40, color: "green" },
    { id: "scale", kind: "text", label: "2", x: 3, y: 57, width: 5, height: 7, color: "gray" },
  ] };
  const save = await openControl(page, "chart", "text_editor", { ...material, visual, mode: "compose", initialText: "", minLength: 10, maxLength: 500, minWords: 0, wordBank: [] });
  const illustration = page.getByRole("figure", { name: "Garden growth", exact: true });
  await expect(illustration.locator("line")).toHaveCount(2);
  await expect(illustration.locator("rect")).toHaveCount(2);
  await expect(illustration).toContainText("Day 1");
  await expect(illustration).toContainText("Day 2");
  await page.getByLabel("Your writing", { exact: true }).fill("The plant grew taller on the second day.");
  expect(await save()).toEqual({ writtenText: "The plant grew taller on the second day." });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
