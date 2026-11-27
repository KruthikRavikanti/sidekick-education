import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import { test, expect, type BrowserContext, type Frame, type Page } from "@playwright/test";
import { createFamily, mutate, PIN } from "./helpers";

const execute = promisify(execFile);

type Loaded = { skill: string; title: string; slug: string; statuses: string[] };

// Finish reading the uploaded sample page (the skill decision is synthetic) and load the game for its skill.
async function readAndLoadGame(kidId: string, uploadId: string, status: "waiting" | "approved") {
  const database = process.env.SIDEKICK_E2E_DATABASE_URL;
  expect(database, "Playwright must provide its isolated database URL").toBeTruthy();
  const { stdout } = await execute("backend/.venv/bin/python", [
    "tests/e2e/game_play_fixture.py",
    database!,
    kidId,
    uploadId,
    status,
  ]);
  return JSON.parse(stdout) as Loaded;
}

async function uploadWork(page: Page, sample: string) {
  await page.goto("/kid/homework");
  await page
    .getByLabel("Choose work image", { exact: true })
    .setInputFiles(path.join(process.cwd(), "public/samples", sample));
  const extracted = page.waitForResponse(
    (response) => response.url().endsWith("/api/extract") && response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Read my work", exact: true }).click();
  const response = await extracted;
  expect(response.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "Here’s your work.", exact: true })).toBeVisible();
  const uploadId = response.headers()["x-sidekick-upload-id"];
  expect(uploadId).toBeTruthy();
  return uploadId;
}

async function enterParent(page: Page, context: BrowserContext) {
  await mutate(context.request, "/api/session/picker");
  await page.goto("/profiles");
  await page.getByRole("button", { name: /Parent.*PIN protected/ }).click();
  await page.getByLabel("Parent PIN", { exact: true }).fill(PIN);
  await page.getByRole("button", { name: "Enter parent mode", exact: true }).click();
  await expect(page).toHaveURL(/\/parent\/dashboard$/);
}

async function enterKid(context: BrowserContext, kidId: string) {
  await mutate(context.request, "/api/session/picker");
  const response = await mutate(context.request, "/api/session/kid", { profileId: kidId });
  expect(response.ok(), await response.text()).toBeTruthy();
}

type Action =
  | { type: "wait"; ms: number }
  | { type: "click"; at: { x: number; y: number } }
  | { type: "drag"; from: { x: number; y: number }; to: { x: number; y: number } };

// Plays the open game from start to finish with real taps and drags on the page, the way a child would.
// The kit says where the pieces are; nothing reaches into the game to mark it solved.
async function playToTheEnd(page: Page) {
  const element = page.locator("iframe.game-frame");
  await expect(element).toBeVisible();
  // The frame is locked: scripts only, no same-origin access, no forms, no popups.
  expect(await element.getAttribute("sandbox")).toBe("allow-scripts");
  let frame: Frame | undefined;
  await expect
    .poll(() => {
      frame = page.frames().find((item) => item.url().includes("/frame"));
      return Boolean(frame);
    })
    .toBe(true);
  const game = frame!;
  await game.waitForFunction(() => {
    const kit = (window as unknown as { __SK?: { manifest: () => unknown } }).__SK;
    return Boolean(kit && kit.manifest());
  });
  // Inside the frame there is no cookie, no storage and no network.
  const inside = await game.evaluate(async () => {
    const attempt = (read: () => unknown) => {
      try {
        return String(read());
      } catch (error) {
        return "blocked: " + (error as Error).name;
      }
    };
    let network = "allowed";
    try {
      await fetch("/api/auth/session");
    } catch (error) {
      network = "blocked: " + (error as Error).name;
    }
    return {
      origin: self.origin,
      cookie: attempt(() => document.cookie),
      storage: attempt(() => localStorage.length),
      network,
    };
  });
  expect(inside.origin).toBe("null");
  expect(inside.cookie).toContain("blocked");
  expect(inside.storage).toContain("blocked");
  expect(inside.network).toContain("blocked");

  const box = async () => (await element.boundingBox())!;
  const view = async () => {
    await element.evaluate((node) => node.scrollIntoView({ block: "start" }));
    await page.evaluate(() => window.scrollBy(0, -70));
    await page.waitForTimeout(200);
  };
  const tap = async (id: string) => {
    const point = await game.evaluate((key) => {
      const node = document.querySelector(`[data-sk-id="${key}"]`)!;
      node.scrollIntoView({ block: "nearest" });
      const rect = node.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }, id);
    const frameBox = await box();
    await page.mouse.click(frameBox.x + point.x, frameBox.y + point.y);
    await page.waitForTimeout(350);
  };
  const act = async (step: unknown) => {
    const actions = (await game.evaluate(
      (value) => (window as unknown as { __SK: { plan: (step: unknown) => unknown } }).__SK.plan(value),
      step,
    )) as Action[];
    const frameBox = await box();
    for (const action of actions) {
      if (action.type === "wait") await page.waitForTimeout(action.ms);
      else if (action.type === "click") {
        await page.mouse.click(frameBox.x + action.at.x, frameBox.y + action.at.y);
        await page.waitForTimeout(140);
      } else {
        await page.mouse.move(frameBox.x + action.from.x, frameBox.y + action.from.y);
        await page.mouse.down();
        await page.mouse.move(
          frameBox.x + (action.from.x + action.to.x) / 2,
          frameBox.y + (action.from.y + action.to.y) / 2 - 8,
          { steps: 6 },
        );
        await page.mouse.move(frameBox.x + action.to.x, frameBox.y + action.to.y, { steps: 8 });
        await page.mouse.up();
        await page.waitForTimeout(260);
      }
    }
  };

  await view();
  await tap("sk-start");
  const rounds = (await game.evaluate(
    () => (window as unknown as { __SK: { manifest: () => { rounds: { autoCheck?: boolean }[] } } }).__SK.manifest().rounds,
  )) as { autoCheck?: boolean }[];
  expect(rounds.length).toBeGreaterThanOrEqual(3);
  for (let index = 0; index < rounds.length; index += 1) {
    await view();
    await page.waitForTimeout(500);
    const steps = (await game.evaluate(
      () => (window as unknown as { __SK: { steps: (kind: string) => unknown[] } }).__SK.steps("solution"),
    )) as unknown[];
    for (const step of steps) await act(step);
    if (!rounds[index].autoCheck) await tap("sk-check");
    await expect
      .poll(() =>
        game.evaluate(() => (window as unknown as { __SK: { state: () => { solved: boolean } } }).__SK.state().solved),
      )
      .toBe(true);
    await tap("sk-check");
  }
  return rounds.length;
}

test("a waiting game stays hidden until a parent approves it, then the child plays it to the end and the parent sees it", async ({
  page,
  context,
}) => {
  test.setTimeout(120_000);
  const family = await createFamily(context);
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  // The child uploads one page. Sidekick reads it and finds the skill.
  const uploadId = await uploadWork(page, "game-math-work.png");
  await expect(page.getByText("How many 1/4 pieces make 3/4?", { exact: true })).toBeVisible();
  const loaded = await readAndLoadGame(family.kid.id, uploadId, "waiting");
  expect(loaded).toMatchObject({ skill: "3.NF.A.1-2", title: "Froggy's Bridge" });
  expect(loaded.statuses).toEqual(["verified"]);

  // The game exists but nobody has approved it, so the child cannot play it yet.
  const soon = page.getByRole("region", { name: "A game is on the way", exact: true });
  await expect(soon).toBeVisible({ timeout: 20_000 });
  await expect(soon.getByRole("button")).toHaveCount(0);
  await expect(page.getByRole("region", { name: "A game for this skill", exact: true })).toHaveCount(0);
  const refused = await mutate(context.request, "/api/games/kid/start", {
    uploadId,
    idempotencyKey: crypto.randomUUID(),
  });
  expect(refused.status()).toBe(409);

  // A parent plays it in the review page and approves it.
  await enterParent(page, context);
  await page.getByRole("button", { name: "Games", exact: true }).click();
  // The link counts every game waiting for review, in this family's queue and the shared library alike.
  await page.getByRole("link", { name: /^Review games \(\d+\)$/ }).click();
  await expect(page).toHaveURL(/\/parent\/games$/);
  const list = page.getByRole("navigation", { name: "Games" });
  await list.getByLabel("Search games").fill(loaded.skill);
  await list.getByRole("button", { name: /Froggy's Bridge/ }).click();
  await expect(page.getByRole("heading", { name: "Froggy's Bridge", level: 2 })).toBeVisible();
  await expect(page.locator("iframe").first()).toBeVisible();
  await page.getByRole("button", { name: "Approve for kids" }).click();
  await expect(page.getByText("Live for kids")).toBeVisible();

  // Back as the child, the same page now leads to the game.
  await enterKid(context, family.kid.id);
  const again = await uploadWork(page, "game-math-work.png");
  expect(again).toBe(uploadId);
  const card = page.getByRole("region", { name: "A game for this skill", exact: true });
  await expect(card).toBeVisible({ timeout: 20_000 });
  await expect(card.getByRole("heading", { name: "Froggy's Bridge", exact: true })).toBeVisible();
  await expect(card.getByText("Know a/b is a copies of 1/b", { exact: true })).toBeVisible();
  await card.getByRole("button", { name: "Play", exact: true }).click();
  await expect(page).toHaveURL(/\/kid\/games\/[0-9a-f]+$/);
  const runId = page.url().split("/").pop()!;
  await expect(page.getByRole("heading", { name: "Froggy's Bridge", level: 1 })).toBeVisible();

  const rounds = await playToTheEnd(page);
  expect(rounds).toBe(4);
  await expect
    .poll(async () => (await (await context.request.get(`/api/games/kid/runs/${runId}`)).json()).status)
    .toBe("completed");
  const run = await (await context.request.get(`/api/games/kid/runs/${runId}`)).json();
  expect(run.result.solo).toMatchObject({ solved: true, firstTry: true, attempts: 1 });

  // The child cannot read another family's history or the review queue.
  expect((await context.request.get(`/api/games/parent/${family.kid.id}/history`)).status()).toBe(403);
  expect((await context.request.get("/api/games/review")).status()).toBe(403);

  // The parent sees what was played. Playing never changes the skill picture, which comes from uploaded work.
  await enterParent(page, context);
  await page.getByRole("button", { name: "Games", exact: true }).click();
  const history = page.locator(".game-history");
  await expect(history.getByText("Froggy's Bridge", { exact: true })).toBeVisible();
  await expect(history.getByText("Got the last round on the first try")).toBeVisible();
  await expect(history.getByRole("link", { name: "Review games" })).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test("a reading and words page leads to its own game", async ({ page, context }) => {
  test.setTimeout(120_000);
  const family = await createFamily(context);
  const uploadId = await uploadWork(page, "game-ela-work.png");
  const loaded = await readAndLoadGame(family.kid.id, uploadId, "approved");
  expect(loaded.skill).toBe("L.3.1-2");
  const card = page.getByRole("region", { name: "A game for this skill", exact: true });
  await expect(card).toBeVisible({ timeout: 20_000 });
  await expect(card.getByRole("heading", { name: loaded.title, exact: true })).toBeVisible();
  await card.getByRole("button", { name: "Play", exact: true }).click();
  await expect(page).toHaveURL(/\/kid\/games\/[0-9a-f]+$/);
  await expect(page.getByText("READING & WORDS · A SIDEKICK GAME")).toBeVisible();
  const runId = page.url().split("/").pop()!;

  // Leaving and coming back picks the same game up again instead of starting a second one.
  await uploadWork(page, "game-ela-work.png");
  await expect(card.getByRole("button", { name: "Keep playing", exact: true })).toBeVisible({ timeout: 20_000 });
  await card.getByRole("button", { name: "Keep playing", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/kid/games/${runId}$`));

  await playToTheEnd(page);
  await expect
    .poll(async () => (await (await context.request.get(`/api/games/kid/runs/${runId}`)).json()).status)
    .toBe("completed");
  // "All done" takes the child home.
  const frame = page.frames().find((item) => item.url().includes("/frame"))!;
  const done = await frame.evaluate(() => {
    const node = document.querySelector('[data-sk-id="sk-done"]')!;
    node.scrollIntoView({ block: "nearest" });
    const rect = node.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  });
  const box = (await page.locator("iframe.game-frame").boundingBox())!;
  await page.mouse.click(box.x + done.x, box.y + done.y);
  await expect(page).toHaveURL(/\/kid$/);
});

test("work with no reliably matched skill shows the reading and no game card", async ({ page, context }) => {
  await createFamily(context);
  let asked = 0;
  await page.route("**/api/games/kid/suggestion?*", async (route) => {
    asked += 1;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        enabled: true,
        state: "none",
        reason: "no_supported_skill",
        targetSkill: null,
        game: null,
        canRequest: false,
        runId: null,
      }),
    });
  });
  await uploadWork(page, "game-math-work.png");
  await expect(page.getByText("How many 1/4 pieces make 3/4?", { exact: true })).toBeVisible();
  await expect.poll(() => asked).toBeGreaterThan(0);
  await expect(page.locator(".game-suggestion")).toHaveCount(0);
  // Nothing from the removed activity flow is requested or shown.
  await expect(page.getByRole("region", { name: "Suggested learning activity" })).toHaveCount(0);
});
