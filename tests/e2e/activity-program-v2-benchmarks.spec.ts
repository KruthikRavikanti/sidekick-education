/** Real auth, reviewed saved exports and runtime APIs; no provider or DTO stubs. */
import { expect, test, type APIRequestContext, type BrowserContext, type Page } from "@playwright/test";
import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import type { ProgramSession } from "../../lib/activity-program-types";

const execute = promisify(execFile);
const ORIGIN = "http://localhost:3300";
const BASE = "/api/activity-programs";
const TITLES = ["Choose a Crossing", "The Garden Walks", "The Traveling Seed Report", "Write What Comes Before"];
type Benchmark = { id: string; title: string; definitionHash: string | null; available: boolean; sessionId: string | null };

async function mutate(request: APIRequestContext, endpoint: string, data: unknown = {}) {
  const token = await (await request.get("/api/auth/csrf")).json();
  return request.post(endpoint, { data, headers: { Origin: ORIGIN, "X-CSRF-Token": token.csrfToken } });
}

async function family(context: BrowserContext) {
  await execute(path.join(process.cwd(), "backend/.venv/bin/python"), ["tests/e2e/signup_fixture.py", process.env.SIDEKICK_E2E_DATABASE_URL!], { env: { ...process.env, APP_ENV: "test" } });
  const email = `benchmark-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
  for (const [endpoint, data] of [
    ["/api/auth/signup", { email, password: "password" }],
    ["/api/parent/pin/setup", { password: "password", pin: "0123", confirmPin: "0123" }],
    ["/api/parent/pin/verify", { pin: "0123" }],
  ] as const) {
    const response = await mutate(context.request, endpoint, data);
    expect(response.ok(), await response.text()).toBeTruthy();
  }
  const created = await mutate(context.request, "/api/parent/profiles", { firstName: "Alex", grade: "3", avatarKey: "fox" });
  expect(created.ok(), await created.text()).toBeTruthy();
  const kid = await created.json();
  const selected = await mutate(context.request, "/api/session/kid", { profileId: kid.id });
  expect(selected.ok(), await selected.text()).toBeTruthy();
  return { email, password: "password" };
}

async function catalog(page: Page) {
  const response = await page.request.get(`${BASE}/benchmarks`);
  expect(response.ok(), await response.text()).toBeTruthy();
  return (await response.json()).benchmarks as Benchmark[];
}

function crossing(page: Page) { return page.locator('[data-benchmark-id="area-first"]'); }

async function startCrossing(page: Page) {
  const response = page.waitForResponse(value => value.url().endsWith(`${BASE}/benchmarks/area-first/sessions`) && value.request().method() === "POST");
  await crossing(page).getByRole("button", { name: "Start activity", exact: true }).click();
  const result = await response;
  expect(result.ok(), await result.text()).toBeTruthy();
  const session = await result.json() as ProgramSession;
  await expect(page).toHaveURL(new RegExp(`/kid/activity-preview/${session.id}$`));
  await expect(page.getByRole("region", { name: "Playable world", exact: true })).toBeVisible();
  return session;
}

test("a signed-out activity link returns through login and kid selection to saved AI examples", async ({ context, page }, testInfo) => {
  const account = await family(context);
  const logout = await mutate(context.request, "/api/auth/logout");
  expect(logout.ok(), await logout.text()).toBeTruthy();
  await page.goto("/kid/activity-preview");
  await expect(page).toHaveURL(/\/login(?:\?|$)/);
  await page.getByLabel("Email", { exact: true }).fill(account.email);
  await page.getByLabel("Password", { exact: true }).fill(account.password);
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/\/profiles(?:\?|$)/);
  await page.getByRole("button", { name: /Alex/ }).click();
  await expect(page).toHaveURL(/\/kid\/activity-preview$/);
  await expect(page.getByRole("heading", { name: "AI-generated activities", exact: true })).toBeVisible();
  for (const title of TITLES) await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
  const saved = await catalog(page);
  expect(saved.map(value => value.title)).toEqual(TITLES);
  expect(saved.every(value => value.available && value.definitionHash?.match(/^[a-f0-9]{64}$/) && value.sessionId === null)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("saved-ai-examples-mobile.png"), fullPage: true });
  const session = await startCrossing(page);
  expect(session.origin).toBe("ai_composed");
  expect(session.definitionHash).toBe(saved.find(value => value.id === "area-first")!.definitionHash);
  expect(session.actionCount).toBe(0);
  const surface = session.stageView!.surfaces!.find(value => value.actionId && value.cells.some(cell => cell.allowed))!;
  const cell = surface.cells.find(value => value.allowed)!;
  await expect(page.locator('[data-world-map]')).toHaveAttribute("data-layout-ready", "true");
  const accepted = page.waitForResponse(value => value.url().endsWith(`${BASE}/sessions/${session.id}/actions`) && value.request().method() === "POST");
  await page.locator(`[data-world-surface=${JSON.stringify(surface.id)}] button[data-surface-cell=${JSON.stringify(cell.id)}]`).click();
  const changed = await (await accepted).json() as ProgramSession;
  expect(changed.revision).toBe(1);
  expect(changed.actionCount).toBe(1);
  await page.reload();
  await expect(page.locator(`[data-world-surface=${JSON.stringify(surface.id)}] [data-surface-cell=${JSON.stringify(cell.id)}]`)).toHaveAttribute("data-selected", "true");
  await page.goto("/kid/activity-preview");
  await expect(crossing(page).getByRole("link", { name: "Continue activity", exact: true })).toHaveAttribute("href", `/kid/activity-preview/${session.id}`);
  await crossing(page).getByRole("link", { name: "Continue activity", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/kid/activity-preview/${session.id}$`));
  const resumed = await page.request.get(`${BASE}/sessions/${session.id}`);
  expect(await resumed.json()).toEqual(changed);
  await page.goto("/kid/activity-preview");
  const freshResponse = page.waitForResponse(value => value.url().endsWith(`${BASE}/benchmarks/area-first/sessions`) && value.request().method() === "POST");
  await crossing(page).getByRole("button", { name: "Start a fresh activity", exact: true }).click();
  const fresh = await (await freshResponse).json() as ProgramSession;
  expect(fresh.id).not.toBe(session.id);
  expect(fresh.definitionHash).toBe(session.definitionHash);
  expect(fresh.actionCount).toBe(0);
  expect(fresh.revision).toBe(0);
  await page.goto("/kid");
  await page.getByRole("link", { name: /^Saved activities/ }).click();
  await expect(page).toHaveURL(/\/kid\/activity-preview$/);
  const signedOut = await mutate(context.request, "/api/auth/logout");
  expect(signedOut.ok()).toBeTruthy();
  await page.goto(`/kid/activity-preview/${session.id}`);
  await expect(page).toHaveURL(/\/login(?:\?|$)/);
  await page.getByLabel("Email", { exact: true }).fill(account.email);
  await page.getByLabel("Password", { exact: true }).fill(account.password);
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await page.getByRole("button", { name: /Alex/ }).click();
  await expect(page).toHaveURL(new RegExp(`/kid/activity-preview/${session.id}$`));
  await expect(page.getByRole("region", { name: "Playable world", exact: true })).toBeVisible();
});

test("another family sees the examples and starts its own private saved activity", async ({ browser, context, page }) => {
  await family(context);
  await page.goto("/kid/activity-preview");
  const first = await startCrossing(page);
  const other = await browser.newContext({ baseURL: ORIGIN, storageState: { cookies: [], origins: [] } });
  try {
    await family(other);
    const otherPage = await other.newPage();
    await otherPage.goto("/kid/activity-preview");
    await expect(crossing(otherPage).getByRole("button", { name: "Start activity", exact: true })).toBeVisible();
    expect((await catalog(otherPage)).find(value => value.id === "area-first")!.sessionId).toBeNull();
    expect((await other.request.get(`${BASE}/sessions/${first.id}`)).status()).toBe(404);
    const second = await startCrossing(otherPage);
    expect(second.id).not.toBe(first.id);
    expect(second.definitionHash).toBe(first.definitionHash);
    expect(second.actionCount).toBe(0);
  } finally { await other.close(); }
});

test("an external login return destination is ignored", async ({ context, page }) => {
  const account = await family(context);
  expect((await mutate(context.request, "/api/auth/logout")).ok()).toBeTruthy();
  await page.goto(`/login?next=${encodeURIComponent("https://example.com/outside")}`);
  await page.getByLabel("Email", { exact: true }).fill(account.email);
  await page.getByLabel("Password", { exact: true }).fill(account.password);
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await page.getByRole("button", { name: /Alex/ }).click();
  await expect(page).toHaveURL(`${ORIGIN}/kid`);
});

test("a parent opening the gallery chooses a child and reaches the saved activities", async ({ context, page }) => {
  await family(context);
  expect((await mutate(context.request, "/api/session/picker")).ok()).toBeTruthy();
  expect((await mutate(context.request, "/api/parent/pin/verify", { pin: "0123" })).ok()).toBeTruthy();
  const parent = await (await context.request.get("/api/auth/session")).json();
  expect(parent.mode).toBe("parent");
  await page.goto("/kid/activity-preview");
  await expect(page).toHaveURL(/\/profiles(?:\?|$)/);
  await page.getByRole("button", { name: /Alex/ }).click();
  await expect(page).toHaveURL(/\/kid\/activity-preview$/);
  await expect(page.getByRole("heading", { name: "AI-generated activities", exact: true })).toBeVisible();
  await expect(crossing(page).getByRole("button", { name: "Start activity", exact: true })).toBeVisible();
  expect((await (await context.request.get("/api/auth/session")).json()).mode).toBe("kid");
});
