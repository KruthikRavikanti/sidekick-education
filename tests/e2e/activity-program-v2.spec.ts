import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import type { ProgramSession } from "../../lib/activity-program-types";
import { createFamily, csrf, mutate, ORIGIN, PIN } from "./helpers";

const ROOT = "/api/activity-programs";

async function request(request: APIRequestContext, endpoint: string, body: unknown) {
  const profile = await (await request.get("/api/auth/session")).json();
  return request.post(endpoint, {
    data: body,
    headers: { Origin: ORIGIN, "X-CSRF-Token": await csrf(request), "X-Sidekick-Profile-Version": String(profile.version) },
  });
}

async function start(page: Page, key: string) {
  const response = await request(page.request, `${ROOT}/preview/${key}/sessions`, { requestId: crypto.randomUUID() });
  expect(response.ok(), await response.text()).toBeTruthy();
  const session = await response.json() as ProgramSession;
  await page.goto(`/kid/activity-preview/${session.id}`);
  await expect(page.getByRole("heading", { name: session.title, exact: true }).first()).toBeVisible();
  return session;
}

async function current(page: Page, id: string) {
  const response = await page.request.get(`${ROOT}/sessions/${id}`);
  expect(response.ok(), await response.text()).toBeTruthy();
  return response.json() as Promise<ProgramSession>;
}

async function expression(page: Page, left: number, right: number, result: number) {
  await page.getByLabel("First factor", { exact: true }).fill(String(left));
  await page.getByLabel("Second factor", { exact: true }).fill(String(right));
  await page.getByLabel("Product", { exact: true }).fill(String(result));
  await page.getByRole("button", { name: "Build the multiplication equality", exact: true }).click();
}

async function capture(page: Page, name: string) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if (process.env.SIDEKICK_CAPTURE_V2_SCREENSHOTS === "true") {
    const folder = path.join(process.cwd(), "docs/activity-engine-v2-preview");
    await mkdir(folder, { recursive: true });
    await page.screenshot({ path: path.join(folder, `${name}.png`), fullPage: true });
  }
}

test.beforeEach(async ({ context }) => { await createFamily(context, "3"); });

test("unit tiles, shared expression and delivered help survive refresh and finish together", async ({ page }) => {
  await page.goto("/kid/activity-preview");
  await page.getByRole("button", { name: "Explore Restore the observatory floor", exact: true }).click();
  await expect(page.getByRole("region", { name: "Unit-square workspace", exact: true })).toBeVisible();
  const id = page.url().split("/").at(-1)!;
  const board = page.getByRole("region", { name: "Unit-square workspace", exact: true });
  await page.getByRole("button", { name: "Place tile at row 1, column 1", exact: true }).press("Enter");
  await expect(board).toHaveAttribute("data-tiles-placed", "1");
  expect((await current(page, id)).outcome.assessment).toBe("not_assessed");
  await page.getByRole("button", { name: "Lift tile at row 1, column 1", exact: true }).click();
  await expect(board).toHaveAttribute("data-tiles-placed", "0");
  await page.getByRole("button", { name: "Get a hint", exact: true }).click();
  await expect(page.getByText(/Look at one row of equal squares/)).toBeVisible();
  await page.reload();
  await expect(page.getByText(/Look at one row of equal squares/)).toBeVisible();
  expect((await current(page, id)).assistance.received).toBe(true);
  for (let row = 1; row <= 2; row++) for (let column = 1; column <= 3; column++) {
    await page.getByRole("button", { name: `Place tile at row ${row}, column ${column}`, exact: true }).click();
    await expect(board).toHaveAttribute("data-tiles-placed", String((row - 1) * 3 + column));
  }
  await expression(page, 2, 3, 6);
  await expect(page.getByRole("heading", { name: "Mission complete", exact: true })).toBeVisible();
  const finished = await current(page, id);
  expect(finished.status).toBe("completed");
  expect(finished.outcome.assisted).toBe(true);
  expect(finished.outcome.assessment).toBe("demonstrated");
  await expect(board).toHaveAttribute("data-tiles-placed", "6");
  await capture(page, "observatory-floor");
  await page.reload();
  await expect(page.getByRole("heading", { name: "Mission complete", exact: true })).toBeVisible();
  await expect(board).toHaveAttribute("data-tiles-placed", "6");
});

test("different habitat factor pairs finish from the same generic controls", async ({ page }) => {
  for (const [rows, columns] of [[2, 6], [3, 4]]) {
    const session = await start(page, "habitat_designer");
    await page.getByLabel("Rows", { exact: true }).fill(String(rows));
    await page.getByLabel("Columns", { exact: true }).fill(String(columns));
    await page.getByRole("button", { name: "Change the rows and columns", exact: true }).click();
    const board = page.getByRole("region", { name: "Unit-square workspace", exact: true });
    await expect(board).toHaveAttribute("data-rows", String(rows));
    await expect(board).toHaveAttribute("data-columns", String(columns));
    await expression(page, columns, rows, 12); // Commutation is another valid construction.
    await expect(page.getByRole("heading", { name: "Mission complete", exact: true })).toBeVisible();
    expect((await current(page, session.id)).outcome.assessment).toBe("demonstrated");
    await capture(page, "habitat-designer");
  }
});

test("either investigation route can place literal evidence and finish", async ({ page }) => {
  for (const route of ["bridge", "gate"]) {
    const session = await start(page, "trail_evidence");
    const material = session.materials.find(value => value.kind === "passage" && value.items.some(item => item.id === `${route}-2`))!;
    const sentence = material.items.find(item => item.id === `${route}-2`)!.text;
    await page.getByRole("button", { name: sentence, exact: true }).click();
    await expect(page.getByRole("heading", { name: "Mission complete", exact: true })).toBeVisible();
    const result = await current(page, session.id);
    expect(result.goals.find(goal => goal.id === `${route}-resolved`)?.achieved).toBe(true);
    expect(result.outcome.assessment).toBe("demonstrated");
    await capture(page, "trail-evidence");
  }
});

test("an original draft and changed revision finish with quality pending parent review", async ({ page }) => {
  const session = await start(page, "story_studio");
  await expect(page.getByText(/Create a rescue-journal opening of at least eight words/)).toBeVisible();
  await page.getByRole("textbox").fill("A short opening.");
  await page.getByRole("button", { name: "Write an opening", exact: true }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  expect((await current(page, session.id)).revision).toBe(0);
  const draft = "Mira stood beside the pond with a paper map. She waited for her brother.";
  const revised = "At dawn, Mira stood beside the pond holding a paper map. She waited for her brother to bring their rescue boat.";
  await page.getByLabel("Your writing", { exact: true }).fill(draft);
  await page.getByRole("button", { name: "Write an opening", exact: true }).click();
  await expect(page.getByRole("textbox")).toHaveValue(draft);
  await page.reload();
  await expect(page.getByRole("textbox")).toHaveValue(draft);
  await page.getByRole("textbox").fill(revised);
  await page.getByRole("button", { name: "Revise your opening", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Mission complete", exact: true })).toBeVisible();
  await expect(page.getByText("Pending parent review", { exact: true })).toBeVisible();
  const finished = await current(page, session.id);
  expect(finished.outcome.assessment).toBe("pending_parent_review");
  expect(finished.actionCount).toBe(2);
  await expect(page.getByRole("textbox")).toHaveValue(revised);
  await capture(page, "story-studio");
});

test("idempotent actions and rejected stale or invalid input preserve authoritative state", async ({ page }) => {
  const session = await start(page, "observatory_floor");
  const endpoint = `${ROOT}/sessions/${session.id}/actions`;
  const body = { requestId: crypto.randomUUID(), expectedRevision: 0, actionId: "place-or-lift", inputs: { cell: "r0c0" } };
  const accepted = await request(page.request, endpoint, body);
  expect(accepted.ok(), await accepted.text()).toBeTruthy();
  const saved = await accepted.json();
  const duplicate = await request(page.request, endpoint, body);
  expect(duplicate.ok()).toBeTruthy();
  expect(await duplicate.json()).toEqual(saved);
  const conflict = await request(page.request, endpoint, { ...body, inputs: { cell: "r0c1" } });
  expect(conflict.status()).toBe(409);
  const stale = await request(page.request, endpoint, { ...body, requestId: crypto.randomUUID() });
  expect(stale.status()).toBe(409);
  const invalid = await request(page.request, endpoint, { ...body, requestId: crypto.randomUUID(), expectedRevision: 1, inputs: { cell: "r99c99" } });
  expect(invalid.status()).toBe(400);
  expect(await current(page, session.id)).toEqual(saved);
  const replay = await request(page.request, `${ROOT}/sessions/${session.id}/replay`, { expectedRevision: 1 });
  expect(replay.ok(), await replay.text()).toBeTruthy();
  expect(await replay.json()).toEqual({ verified: true, eventCount: 1, session: saved });
});

test("another account or active child cannot read or change a private world", async ({ page, browser, context }) => {
  const session = await start(page, "story_studio");
  const other = await browser.newContext({ baseURL: ORIGIN });
  try {
    await createFamily(other);
    expect((await other.request.get(`${ROOT}/sessions/${session.id}`)).status()).toBe(404);
    expect((await request(other.request, `${ROOT}/sessions/${session.id}/actions`, { requestId: crypto.randomUUID(), expectedRevision: 0, actionId: "write-opening", inputs: { text: "Private draft" } })).status()).toBe(404);
  } finally { await other.close(); }
  await mutate(context.request, "/api/session/picker");
  await mutate(context.request, "/api/parent/pin/verify", { pin: PIN });
  const created = await mutate(context.request, "/api/parent/profiles", { firstName: "Maya", grade: "3", avatarKey: "bear" });
  expect(created.ok(), await created.text()).toBeTruthy();
  await mutate(context.request, "/api/session/kid", { profileId: (await created.json()).id });
  expect((await context.request.get(`${ROOT}/sessions/${session.id}`)).status()).toBe(404);
  expect((await request(context.request, `${ROOT}/sessions/${session.id}/help`, { requestId: crypto.randomUUID(), expectedRevision: 0, helpId: "look-again" })).status()).toBe(404);
});

test("remixed IDs, original content and changed valid quantities use the same renderer", async ({ page }) => {
  const session = await start(page, "remixed-workspace");
  await expect(page.getByText(/Build a moon greenhouse using all 8 square panels/).first()).toBeVisible();
  await expect(page.getByLabel("Rows", { exact: true })).toHaveAttribute("max", "4");
  await page.getByLabel("Rows", { exact: true }).fill("2");
  await page.getByLabel("Columns", { exact: true }).fill("4");
  await page.getByRole("button", { name: "Change the rows and columns", exact: true }).click();
  await expect(page.getByRole("region", { name: "Unit-square workspace", exact: true })).toHaveAttribute("data-columns", "4");
  await expression(page, 2, 4, 8);
  await expect(page.getByRole("heading", { name: "Mission complete", exact: true })).toBeVisible();
  expect((await current(page, session.id)).status).toBe("completed");
  expect(session.programId).not.toBe("habitat_designer");
});

test("an uncertain proxy failure retries the accepted move with its original request ID", async ({ page }) => {
  const session = await start(page, "observatory_floor");
  const bodies: unknown[] = [];
  let loseFirstResponse = true;
  await page.route(`**${ROOT}/sessions/${session.id}/actions`, async route => {
    bodies.push(route.request().postDataJSON());
    if (loseFirstResponse) {
      loseFirstResponse = false;
      const saved = await route.fetch();
      expect(saved.ok()).toBeTruthy();
      // Simulate the server committing before the proxy loses its response.
      await route.fulfill({ status: 502, json: { error: { code: "proxy_unavailable", message: "The save response was interrupted." } } });
    } else await route.continue();
  });
  await page.getByRole("button", { name: "Place tile at row 1, column 1", exact: true }).click();
  await expect(page.getByRole("button", { name: "Retry saving the same move", exact: true })).toBeVisible();
  expect((await current(page, session.id)).actionCount).toBe(1);
  await page.getByRole("button", { name: "Retry saving the same move", exact: true }).click();
  await expect(page.getByRole("region", { name: "Unit-square workspace", exact: true })).toHaveAttribute("data-tiles-placed", "1");
  expect(bodies).toHaveLength(2);
  expect(bodies[1]).toEqual(bodies[0]);
  const result = await current(page, session.id);
  expect(result.actionCount).toBe(1);
  expect(result.revision).toBe(1);
});
