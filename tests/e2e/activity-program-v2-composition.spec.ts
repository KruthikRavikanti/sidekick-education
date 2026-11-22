import { expect, test } from "@playwright/test";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, writeFile } from "node:fs/promises";
import { createFamily, csrf, ORIGIN } from "./helpers";
import { visibleMove, world, type PublicMove } from "./activity_program_public_driver";
const execute = promisify(execFile);

function step(actionId: string, values: Record<string, number | string>): PublicMove {
  return { actionId, inputs: Object.entries(values).map(([name, value]) => ({ name,
    kind: typeof value === "number" ? "integer" : "text", integer: typeof value === "number" ? value : null,
    text: typeof value === "string" ? value : null })) };
}

test("normal upload composes an admitted new program, refreshes progress and plays saved state", async ({ page, context }) => {
  const family = await createFamily(context);
  await page.goto("/kid/homework");
  await page.getByLabel("Choose work image", { exact: true }).setInputFiles(path.join(process.cwd(), "public/samples/activity-composed-area-work.png"));
  const upload = page.waitForResponse(response => response.url().endsWith("/api/extract") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Read my work", exact: true }).click();
  const extracted = await upload;
  expect(extracted.ok()).toBeTruthy();
  // Fixture mode deliberately does not fabricate analysis. Inject explicit
  // synthetic model decisions through the existing guarded test helper.
  await execute("backend/.venv/bin/python", ["tests/e2e/composed_activity_fixture.py",
    process.env.SIDEKICK_E2E_DATABASE_URL!, family.kid.id, extracted.headers()["x-sidekick-upload-id"]]);
  const card = page.getByRole("region", { name: "Create a learning activity", exact: true });
  await expect(card.getByRole("button", { name: "Create an activity", exact: true })).toBeEnabled();
  const generationBodies: unknown[] = [];
  let interruptFirst = true;
  await page.route("**/api/activity-programs/uploads/*/generations", async route => {
    generationBodies.push(route.request().postDataJSON());
    if (interruptFirst) {
      interruptFirst = false;
      const response = await route.fetch();
      expect(response.status()).toBe(202);
      await route.abort("failed"); // The reservation exists before the response is lost.
    } else await route.continue();
  });
  await card.getByRole("button", { name: "Create an activity", exact: true }).click();
  await expect(card.getByRole("button", { name: "Recover activity creation", exact: true })).toBeVisible();
  await card.getByRole("button", { name: "Recover activity creation", exact: true }).click();
  await expect(page).toHaveURL(/\/kid\/activity-preview\/generations\//);
  const statusURL = page.url();
  await page.reload();
  await expect(page).toHaveURL(/\/kid\/activity-preview\/[a-f0-9]+$/);
  const id = page.url().split("/").at(-1)!;
  await expect(page.getByText("Created for your learning · Development preview", { exact: true })).toBeVisible();
  let current = await world(page, id);
  expect(current.actionCount).toBe(0);
  expect(current.revision).toBe(0);
  expect(generationBodies).toHaveLength(2);
  expect(generationBodies[1]).toEqual(generationBodies[0]);
  const ownedJobs = await (await context.request.get("/api/activity-programs/generations")).json();
  expect(ownedJobs.generations).toHaveLength(1);
  await page.getByRole("button", { name: "Get a hint", exact: true }).click();
  await expect.poll(async () => (await world(page, id)).assistance.received).toBe(true);
  current = await world(page, id);
  for (let row = 0; row < 2; row++) for (let column = 0; column < 3; column++) {
    current = await visibleMove(page, current, step("place", { cell: `r${row}c${column}` }));
  }
  current = await visibleMove(page, current, step("multiply", { left: 2, right: 3, result: 6 }));
  expect(current.outcome.assessment).toBe("demonstrated");
  expect(current.outcome.assisted).toBe(true);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Mission complete", exact: true })).toBeVisible();
  expect(await world(page, id)).toEqual(current);
  await page.goto(statusURL);
  await expect(page).toHaveURL(new RegExp(`/kid/activity-preview/${id}$`));
  const account = await (await context.request.get("/api/auth/session")).json();
  const replay = await context.request.post(`/api/activity-programs/sessions/${id}/replay`, {
    data: { expectedRevision: current.revision }, headers: { Origin: ORIGIN, "X-CSRF-Token": await csrf(context.request), "X-Sidekick-Profile-Version": String(account.version) },
  });
  expect(replay.ok()).toBeTruthy();
  expect((await replay.json()).verified).toBe(true);
  await page.goto("/kid/activity-preview");
  await expect(page.getByRole("region", { name: "Created from your work", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open saved activity", exact: true })).toBeVisible();
});

test("stubbed writing composition saves actual drafts and completes with quality pending review", async ({ page, context }) => {
  const family = await createFamily(context);
  await page.goto("/kid/homework");
  await page.getByLabel("Choose work image", { exact: true }).setInputFiles(path.join(process.cwd(), "public/samples/activity-catalog-writing-work.png"));
  const uploaded = page.waitForResponse(response => response.url().endsWith("/api/extract") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Read my work", exact: true }).click();
  const extracted = await uploaded;
  expect(extracted.ok()).toBeTruthy();
  await execute("backend/.venv/bin/python", ["tests/e2e/catalog_activity_fixture.py",
    process.env.SIDEKICK_E2E_DATABASE_URL!, family.kid.id, extracted.headers()["x-sidekick-upload-id"]]);
  const card = page.getByRole("region", { name: "Create a learning activity", exact: true });
  await card.getByRole("button", { name: "Create an activity", exact: true }).click();
  await expect(page).toHaveURL(/\/kid\/activity-preview\/[a-f0-9]+$/);
  const id = page.url().split("/").at(-1)!;
  let current = await world(page, id);
  expect(current.actionCount).toBe(0);
  const draft = "Tari was folding paper boats beside the school gate when somebody tapped her shoulder.";
  const revised = "Before school, Tari folded a paper boat beside the quiet gate. A tiny robot tapped her shoulder and held out a lost blue button.";
  current = await visibleMove(page, current, step("write", { text: draft }));
  await page.reload();
  await expect(page.getByRole("textbox")).toHaveValue(draft);
  current = await visibleMove(page, current, step("revise", { text: revised }));
  expect(current.outcome.assessment).toBe("pending_parent_review");
  expect(current.actionCount).toBe(2);
  await expect(page.getByRole("heading", { name: "Mission complete", exact: true })).toBeVisible();
  await expect(page.getByText("Pending parent review", { exact: true })).toBeVisible();
  await expect(page.getByRole("textbox")).toHaveValue(revised);
  if (process.env.SIDEKICK_CAPTURE_V2_STUB_SCREENSHOT === "true") {
    const folder = path.join(process.cwd(), "docs/activity-engine-v2-composition");
    await mkdir(folder, { recursive: true });
    await page.evaluate(() => {
      const label = document.createElement("p");
      label.className = "program-preview-note";
      label.textContent = "AUTOMATED TEST · STUBBED MODEL · LIVE GENERATION UNVERIFIED";
      document.querySelector("main")?.prepend(label);
    });
    await page.screenshot({ path: path.join(folder, "writing-stub.png"), fullPage: true });
    await writeFile(path.join(folder, "writing-stub-report.json"), JSON.stringify({
      source: "explicit_model_stub", liveProviderVerified: false, definitionHash: current.definitionHash,
      generatedAndAdmitted: true, browserCompleted: current.status === "completed", actualSavedTextRevisions: 2,
      refreshRestored: true, assessment: current.outcome.assessment, assessedSuccess: false,
    }, null, 2) + "\n");
  }
});
