import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { test, expect, type Page } from "@playwright/test";
import { createFamily, mutate, PIN } from "./helpers";

const execute = promisify(execFile);

async function learningFixture(kidId: string, mode: "adult" | "solo") {
  const database = process.env.SIDEKICK_E2E_DATABASE_URL;
  expect(database, "Playwright must provide its isolated database URL").toBeTruthy();
  const { stdout } = await execute("backend/.venv/bin/python", ["tests/e2e/gap_fixture.py", database!, kidId, mode]);
  return JSON.parse(stdout) as { subskillId: string; name: string; answer: string | null };
}

async function enterParent(page: Page) {
  await page.goto("/profiles");
  await page.getByRole("button", { name: /Parent.*PIN protected/ }).click();
  await page.getByLabel("Parent PIN", { exact: true }).fill(PIN);
  await page.getByRole("button", { name: "Enter parent mode", exact: true }).click();
  await expect(page).toHaveURL(/\/parent\/dashboard$/);
}

function responseKeys(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(responseKeys);
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, item]) => [key, ...responseKeys(item)]);
}

test("recorded reading errors produce a real check that a parent can prepare and review", async ({ page, context }) => {
  const family = await createFamily(context);
  const fixture = await learningFixture(family.kid.id, "adult");
  await mutate(context.request, "/api/session/picker");
  await enterParent(page);
  await page.getByRole("searchbox", { name: "Find a skill" }).fill(fixture.name);
  const card = page.locator(".skill-card").filter({ has: page.getByRole("heading", { name: fixture.name, exact: true }) }).first();
  await expect(card.getByText("Checking", { exact: true })).toBeVisible();
  await card.getByText("See the learning story", { exact: true }).click();
  await expect(card.getByText("Homework evidence (2)", { exact: true })).toBeVisible();
  const prepared = page.waitForResponse(response => response.url().endsWith(`/api/learning/parent/${family.kid.id}/extra-practice`) && response.request().method() === "POST");
  await card.getByRole("button", { name: "Send extra practice", exact: true }).click();
  const preparedResponse = await prepared;
  expect(preparedResponse.status()).toBe(200);
  expect((await preparedResponse.json()).state).toBe("open");
  await page.getByRole("button", { name: "Try this together", exact: true }).click();
  const adultCard = page.locator(".adult-item");
  await expect(adultCard).toBeVisible();
  await expect(adultCard.getByText("Expected response:", { exact: false })).toBeVisible();
  const firstQuestion = await adultCard.getByRole("heading").textContent();
  await adultCard.getByRole("button", { name: "Unclear · keep pending", exact: true }).click();
  await expect(adultCard.getByRole("heading")).toHaveText(firstQuestion!);
  await expect(adultCard.getByRole("button", { name: "Correct", exact: true })).toBeEnabled();
  for (let index = 0; index < 5; index++) {
    const graded = page.waitForResponse(response => response.url().endsWith(`/api/learning/parent/${family.kid.id}/adult/submit`) && response.request().method() === "POST");
    const refreshed = page.waitForResponse(response => response.url().endsWith(`/api/learning/parent/${family.kid.id}/adult`) && response.request().method() === "GET");
    await adultCard.getByRole("button", { name: "Correct", exact: true }).click();
    expect((await graded).status()).toBe(200);
    expect((await (await refreshed).json()).items).toHaveLength(4 - index);
    if (index < 4) await expect(adultCard.getByRole("button", { name: "Correct", exact: true })).toBeEnabled();
  }
  await expect(page.getByText("No activities are waiting for adult review.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Skills", exact: true }).click();
  await page.getByRole("searchbox", { name: "Find a skill" }).fill(fixture.name);
  await expect(page.locator(".skill-card").filter({ has: page.getByRole("heading", { name: fixture.name, exact: true }) }).first().getByText("On track", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Analytics", exact: true }).click();
  await expect(page.locator(".metric-card strong")).toHaveText(["1", "0 min", "5", "5", "0"]);
  const dashboard = await (await context.request.get(`/api/learning/parent/${family.kid.id}/dashboard`)).json();
  expect(dashboard.sample).toBe(false);
  expect(dashboard.analytics.problemsUngraded).toBe(0);
});

test("child practice keeps answer keys private, records a response, and resumes the session", async ({ page, context }) => {
  const family = await createFamily(context);
  const fixture = await learningFixture(family.kid.id, "solo");
  const nextResponse = page.waitForResponse(response => response.url().endsWith("/api/learning/kid/next") && response.request().method() === "POST");
  await page.goto("/kid/practice");
  const initial = await (await nextResponse).json();
  expect(initial.items).toHaveLength(5);
  const privateKeys = new Set(["answer", "gradingSpec", "grading_spec", "exactFraction", "expectedValues", "correctOptionId", "rubric", "expectedResponse", "verificationResult", "original"]);
  expect(responseKeys(initial).filter(key => privateKeys.has(key))).toEqual([]);
  await expect(page.getByRole("heading", { name: "Let’s practice.", exact: true })).toBeVisible();
  await expect(page.getByText("Expected response:", { exact: false })).toHaveCount(0);
  await page.getByLabel("Your answer", { exact: true }).fill(fixture.answer!);
  const graded = page.waitForResponse(response => response.url().endsWith("/api/learning/kid/submit") && response.request().method() === "POST");
  await page.getByRole("button", { name: /Submit answer/ }).click();
  expect((await (await graded).json()).correctness).toBe("correct");
  await expect(page.locator(".learning-item h2")).not.toHaveText(initial.items[0].question);
  const resumedResponse = page.waitForResponse(response => response.url().endsWith("/api/learning/kid/next") && response.request().method() === "POST");
  await page.reload();
  const resumed = await (await resumedResponse).json();
  expect(resumed.sessionId).toBe(initial.sessionId);
  expect(resumed.items).toHaveLength(4);
  expect(resumed.items.some((item: { assignmentItemId: string }) => item.assignmentItemId === initial.items[0].assignmentItemId)).toBe(false);
  expect((await context.request.get(`/api/learning/parent/${family.kid.id}/dashboard`)).status()).toBe(403);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("parent homework shows saved processing progress, authorizes the private original, and deletes it", async ({ page, context }) => {
  const family = await createFamily(context);
  await mutate(context.request, "/api/session/picker");
  await enterParent(page);
  await page.getByRole("button", { name: "Homework", exact: true }).click();
  const base = `/api/learning/parent/${family.kid.id}/uploads`;
  const saved = page.waitForResponse(response => response.url().endsWith(base) && response.request().method() === "POST");
  await page.getByLabel("Upload homework", { exact: true }).setInputFiles(path.join(process.cwd(), "public/samples/math-worksheet.png"));
  const savedResponse = await saved;
  expect(savedResponse.status()).toBe(200);
  const upload = await savedResponse.json();
  expect(["pending", "processing", "completed"]).toContain(upload.state);
  await expect(page.getByRole("heading", { name: "Worksheet processing", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Here’s your worksheet.", exact: true })).toBeVisible();
  const privateFile = `${base}/${upload.id}/file`;
  await expect(page.getByRole("link", { name: "Open private original", exact: true })).toHaveAttribute("href", privateFile);
  const original = await context.request.get(privateFile);
  expect(original.status()).toBe(200);
  expect(original.headers()["cache-control"]).toContain("no-store");
  expect(original.headers()["content-type"]).toContain("image/png");
  const siblingResponse = await mutate(context.request, "/api/parent/profiles", { firstName: "Maya", grade: "1", avatarKey: "owl" });
  const sibling = await siblingResponse.json();
  expect((await context.request.get(`/api/learning/parent/${sibling.id}/uploads/${upload.id}/file`)).status()).toBe(404);
  await page.getByRole("button", { name: "Delete upload", exact: true }).click();
  await expect(page.getByRole("alertdialog", { name: "Delete homework upload" })).toBeVisible();
  await page.getByRole("button", { name: "Confirm delete upload", exact: true }).click();
  await expect(page.getByText("No homework has been uploaded for this child yet.", { exact: true })).toBeVisible();
  expect((await context.request.get(privateFile)).status()).toBe(404);
});
