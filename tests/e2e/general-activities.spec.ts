import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import { expect, test, type Page } from "@playwright/test";
import type { ActivitySession } from "../../lib/activity-types";
import { createFamily, mutate, PIN } from "./helpers";

const execute = promisify(execFile);
const cases = [
  { name: "bundles", skill: "1.NBT.B.2-1", component: "bundle_builder" },
  { name: "sequence", skill: "RI.3.3-1", component: "tile_order" },
  { name: "evidence", skill: "RI.3.1-1", component: "evidence_board" },
] as const;

function keys(value: unknown): string[] {
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap(keys);
  return Object.entries(value).flatMap(([key, item]) => [key, ...keys(item)]);
}

async function act(page: Page, kind: string, index: number) {
  if (kind === "bundles") {
    const total = [23, 36, 42][index];
    const board = page.getByRole("region", { name: "Bundle objects", exact: true });
    await expect(board).toHaveAttribute("data-total", String(total));
    for (let count = 1; count <= Math.floor(total / 10); count++) {
      const pack = page.getByRole("button", { name: "Bundle 10", exact: true });
      if (index === 0 && count === 1) await pack.press("Enter");
      else await pack.click();
      await expect(board).toHaveAttribute("data-bundles", String(count));
      await expect(board).toHaveAttribute("data-loose", String(total - count * 10));
      await expect(page.getByTestId("object-group")).toHaveCount(count);
      await expect(page.getByTestId("loose-object")).toHaveCount(total - count * 10);
    }
    // A reversible action changes the scene, while conserving every object.
    if (index === 0) {
      await page.getByRole("button", { name: "Unpack a group", exact: true }).click();
      await expect(board).toHaveAttribute("data-bundles", "1");
      await expect(board).toHaveAttribute("data-loose", "13");
      await page.getByRole("button", { name: "Bundle 10", exact: true }).click();
    }
  } else if (kind === "sequence") {
    const steps = [
      ["Cut a diamond from paper.", "Tie sticks to the cut paper.", "Attach string to the finished kite."],
      ["Fold a sheet of paper.", "Cut slits in the folded sheet.", "Open the sheet and join its ends."],
      ["Wash the whole apple.", "Slice the washed apple.", "Put the slices on a plate."],
    ][index];
    for (const [position, text] of steps.entries()) {
      const tile = page.getByRole("button", { name: `Place ${text}`, exact: true });
      if (index === 0 && position === 0) await tile.press("Space");
      else await tile.click();
    }
    const list = page.getByRole("list", { name: "Your arrangement", exact: true });
    await expect(list.getByRole("listitem")).toHaveCount(3);
    if (index === 0) {
      await page.getByRole("button", { name: "Move tile 3 earlier", exact: true }).click();
      await expect(list.getByRole("listitem").nth(1)).toContainText(steps[2]);
      await page.getByRole("button", { name: "Move tile 2 later", exact: true }).click();
    }
    for (let i = 0; i < steps.length; i++) await expect(list.getByRole("listitem").nth(i)).toContainText(steps[i]);
  } else {
    await page.getByRole("button", { name: "Choose sentence 2", exact: true }).press("Enter");
    await page.getByRole("button", { name: "Place on clue board", exact: true }).press("Space");
    await expect(page.getByTestId("clue-board")).toContainText([
      "Rain was falling, so Jo took an umbrella.",
      "The kitchen was too warm, so the baker opened the window.",
      "Thunder sounded, so the team stopped the game and went indoors.",
    ][index]);
  }
}

for (const example of cases) {
  test(`${example.name}: upload, generate, act, fresh challenge, protected parent outcome`, async ({ page, context }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    const family = await createFamily(context);
    await page.goto("/kid/homework");
    await page.getByLabel("Choose work image", { exact: true }).setInputFiles(
      path.join(process.cwd(), `public/samples/activity-toolkit-${example.name}-work.png`),
    );
    const extracted = page.waitForResponse(r => r.url().endsWith("/api/extract") && r.request().method() === "POST");
    await page.getByRole("button", { name: "Read my work", exact: true }).click();
    const upload = await extracted;
    expect(upload.status()).toBe(200);
    const uploadId = upload.headers()["x-sidekick-upload-id"];
    expect(uploadId).toBeTruthy();
    await execute("backend/.venv/bin/python", ["tests/e2e/general_activity_fixture.py", process.env.SIDEKICK_E2E_DATABASE_URL!, family.kid.id, uploadId]);
    const launch = page.getByRole("button", { name: "Try an activity", exact: true });
    await expect(launch).toBeVisible();
    if (example.name === "evidence") {
      let failed = false;
      await page.route("**/api/activities/kid/start", async route => {
        if (failed) return route.continue();
        failed = true;
        await route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({error:{code:"activity_unavailable", message:"We couldn’t prepare an activity right now. Please try again."}}) });
      });
      await launch.click();
      await expect(page.getByRole("region", { name: "Suggested learning activity" }).getByRole("alert")).toContainText("Please try again");
    }
    const started = page.waitForResponse(r => r.url().endsWith("/api/activities/kid/start") && r.status() === 200);
    await launch.click();
    const session = await (await started).json() as ActivitySession;
    expect(session.targetSkill.id).toBe(example.skill);
    expect(session.origin).toBe("model_generated");
    expect(session.currentScene?.component).toBe(example.component);
    expect(keys(session).filter(k => ["answer", "acceptedAnswers", "comparison", "scenes", "nextSceneId", "explanation"].includes(k))).toEqual([]);
    await expect(page).toHaveURL(new RegExp(`/kid/activities/${session.id}$`));
    for (let index = 0; index < 3; index++) {
      await expect(page.getByRole("region", { name: "Learning tip", exact: true })).toHaveCount(index < 2 ? 1 : 0);
      if (index === 2) {
        await expect(page.getByText("Try this on your own", { exact: true })).toBeVisible();
        await expect(page.getByRole("button", { name: "Show a hint", exact: true })).toHaveCount(0);
      }
      await act(page, example.name, index);
      if (index === 0) {
        const animated = page.locator(example.name === "bundles" ? ".bundle-group.toolkit-animate" : example.name === "sequence" ? ".tile-order-card.toolkit-animate" : ".evidence-clue-board blockquote").last();
        await expect(animated).toHaveCSS("animation-name", "toolkit-place-in");
        await page.emulateMedia({ reducedMotion: "reduce" });
        await expect(animated).toHaveCSS("animation-name", "none");
        await page.emulateMedia({ reducedMotion: "no-preference" });
      }
      await page.screenshot({ path: test.info().outputPath(`${example.name}-${index === 2 ? "independent" : "guided"}.png`), fullPage: true });
      await page.getByRole("button", { name: index === 2 ? "Save my answer" : "Check it", exact: true }).click();
      if (index < 2) {
        if (index === 0) {
          await page.getByRole("button", { name: "Show a hint", exact: true }).click();
          await page.reload();
          await expect(page.getByRole("button", { name: "Next", exact: true })).toBeEnabled();
          if (example.name === "bundles") await expect(page.getByRole("region", {name:"Bundle objects", exact:true})).toHaveAttribute("data-bundles", "2");
          if (example.name === "sequence") await expect(page.getByRole("list", {name:"Your arrangement", exact:true}).getByRole("listitem")).toHaveCount(3);
          if (example.name === "evidence") await expect(page.getByTestId("clue-board")).toContainText("Rain was falling");
        }
        const advanced = page.waitForResponse(r => r.url().endsWith(`/api/activities/kid/sessions/${session.id}/next`) && r.status() === 200);
        await page.getByRole("button", { name: "Next", exact: true }).click();
        const next = await (await advanced).json() as ActivitySession;
        await expect(page.getByRole("heading", {name: next.currentScene!.prompt, exact:true})).toBeVisible();
      }
    }
    await expect(page.getByText("ACTIVITY COMPLETE", { exact: true })).toBeVisible();
    const finished = await (await context.request.get(`/api/activities/kid/sessions/${session.id}`)).json();
    expect(finished.finalResult.correct).toBe(true);
    expect(finished.finalResult.response).toBeTruthy();
    expect((await context.request.get(`/api/activities/parent/${family.kid.id}/history`)).status()).toBe(403);
    await mutate(context.request, "/api/session/picker");
    await page.goto("/profiles");
    await page.getByRole("button", { name: /Parent.*PIN protected/ }).click();
    await page.getByLabel("Parent PIN", { exact: true }).fill(PIN);
    await page.getByRole("button", { name: "Enter parent mode", exact: true }).click();
    await page.getByRole("button", { name: "Activities", exact: true }).click();
    await expect(page.getByRole("heading", { name: session.title, exact: true })).toBeVisible();
    await expect(page.locator(".activity-history-result")).toContainText(finished.finalResult.response);
    const history = await (await context.request.get(`/api/activities/parent/${family.kid.id}/history`)).json();
    expect(history.activities).toHaveLength(1);
    expect(history.activities[0].finalResult).toEqual(finished.finalResult);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test("a previously blocked K–5 skill now offers a playable activity", async ({page, context}) => {
  const family = await createFamily(context);
  await page.goto("/kid/homework");
  await page.getByLabel("Choose work image", {exact:true}).setInputFiles(path.join(process.cwd(), "public/samples/activity-math-general-work.png"));
  const uploaded = page.waitForResponse(r => r.url().endsWith("/api/extract") && r.request().method() === "POST");
  await page.getByRole("button", {name:"Read my work", exact:true}).click();
  const upload = await uploaded;
  await execute("backend/.venv/bin/python", ["tests/e2e/general_activity_fixture.py", process.env.SIDEKICK_E2E_DATABASE_URL!, family.kid.id, upload.headers()["x-sidekick-upload-id"]]);
  await expect(page.getByRole("button", {name:"Try an activity", exact:true})).toBeVisible();
  await expect(page.getByRole("heading", {name:"No activity for this skill yet.", exact:true})).toHaveCount(0);
});
