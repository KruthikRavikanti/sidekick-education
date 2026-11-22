/** Actual saved model compositions, public-material decisions, no witness autoplay. */
import { expect, test } from "@playwright/test";
import { copyFile, mkdir, unlink, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createFamily, csrf, ORIGIN } from "./helpers";
import { visibleMove, world, type PublicMove } from "./activity_program_public_driver";
import type { ProgramSession } from "../../lib/activity-program-types";

const execute = promisify(execFile);
const configPath = process.env.SIDEKICK_GAME_PRIVATE_CONFIG!;
const proof = JSON.parse(readFileSync(configPath, "utf8"));
const selected = process.env.SIDEKICK_GAME_CASES?.split(",") || ["area-first", "area-second", "ela-reading", "ela-writing"];
const artifacts = path.join(process.cwd(), "docs/activity-engine-v2-game-design");

async function updateReport(name: string, values: Record<string, unknown>) {
  // Use the same interprocess merge lock as the provider verification jobs.
  await execute("backend/.venv/bin/python", ["-c", [
    "import json,sys",
    "from pathlib import Path",
    "from scripts.compose_game_design_case import update_json",
    "p=Path(sys.argv[1]); name=sys.argv[2]; values=json.loads(sys.argv[3])",
    "update_json(p,lambda data: next(item for item in data['cases'] if item['case']==name).update(values))",
  ].join("\n"), proof.report, name, JSON.stringify(values)]);
}

for (const name of selected) test(`play saved live world: ${name}`, async ({ browser }) => {
  const job = proof.jobs[name];
  const report = JSON.parse(readFileSync(proof.report, "utf8"));
  const expectedHash = report.cases.find((item: { case: string }) => item.case === name).definitionHash;
  expect(expectedHash).toMatch(/^[a-f0-9]{64}$/);
  for (const key of ["definitionHash", "rehearsalDefinitionHash", "playDefinitionHash", "publicPlanDefinitionHash"]) expect(job[key]).toBe(expectedHash);
  expect(job?.playSessionId, "Prepare a fresh engineering play attempt first").toBeTruthy();
  expect(job.publicPlan.length, "Plan from public projections before recording").toBeGreaterThan(0);
  expect(job.publicPlan.some((step: { purpose?: string }) => ["experiment", "alternative"].includes(step.purpose || ""))).toBe(true);
  expect(job.publicPlan.some((step: { purpose?: string }) => step.purpose === "recovery")).toBe(true);
  expect(job.publicPlan.some((step: { purpose?: string }) => step.purpose === "choice")).toBe(true);
  await mkdir(artifacts, { recursive: true });
  const context = await browser.newContext({ baseURL: ORIGIN, storageState: proof.browserState,
    viewport: { width: 1280, height: 900 }, recordVideo: { dir: path.join(artifacts, ".recordings"), size: { width: 1280, height: 900 } } });
  const page = await context.newPage();
  const pointerDiagnostics = process.env.SIDEKICK_GAME_POINTER_DIAGNOSTICS === "true";
  const requestDiagnostics: { time: number; actionId: string | null }[] = [];
  if (pointerDiagnostics) {
    page.on("request", request => {
      if (request.method() === "POST" && request.url().endsWith("/actions")) requestDiagnostics.push({ time: Date.now(), actionId: request.postDataJSON()?.actionId || null });
    });
    await page.addInitScript(() => {
      const events: Record<string, unknown>[] = [];
      (window as Window & { sidekickPointerDiagnostics?: Record<string, unknown>[] }).sidekickPointerDiagnostics = events;
      for (const kind of ["pointerdown", "pointerup", "mousedown", "mouseup", "click"]) document.addEventListener(kind, event => {
        const pointer = event as MouseEvent;
        const target = event.target instanceof Element ? event.target : null;
        const button = target?.closest("button");
        const atPoint = document.elementFromPoint(pointer.clientX, pointer.clientY);
        events.push({ kind, time: Date.now(), tag: target?.tagName, surface: target?.closest("[data-world-surface]")?.getAttribute("data-world-surface"), cell: button?.getAttribute("data-surface-cell"), worldEntity: button?.getAttribute("data-world-entity"), worldLocation: button?.getAttribute("data-world-location"), disabled: button?.disabled, busy: document.querySelector(".program-player")?.getAttribute("aria-busy"), pointCell: atPoint?.closest("button")?.getAttribute("data-surface-cell"), x: pointer.clientX, y: pointer.clientY, scrollY });
        if (kind === "click") setTimeout(() => events.push({ kind: "after-click", time: Date.now(), busy: document.querySelector(".program-player")?.getAttribute("aria-busy"), scrollY }), 0);
      }, true);
    });
  }
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.name));
  let current: ProgramSession;
  let verified: Record<string, unknown> | undefined;
  await updateReport(name, { browserCompleted: false, browserAttemptStatus: "started" });
  try {
    const pristine = await world(page, job.sessionId);
    expect(pristine.actionCount).toBe(0);
    expect(pristine.revision).toBe(0);
    expect(pristine.assistance.received).toBe(false);
    expect(pristine.definitionHash).toBe(expectedHash);
    await page.goto(`/kid/activity-preview/${job.playSessionId}`);
    await expect(page.getByRole("region", { name: "Playable world", exact: true })).toBeVisible();
    current = await world(page, job.playSessionId);
    expect(current.actionCount).toBe(0);
    expect(current.revision).toBe(0);
    expect(current.assistance.received).toBe(false);
    expect(current.definitionHash).toBe(expectedHash);
    await expect(page.locator('[data-world-map]')).toHaveAttribute("data-layout-ready", "true");
    await page.screenshot({ path: path.join(artifacts, `${name}-desktop.png`), fullPage: true, animations: "disabled" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(700);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: path.join(artifacts, `${name}-mobile.png`), fullPage: true, animations: "disabled" });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.waitForTimeout(700);
    let refreshed = false;
    let helped = false;
    let duplicateChecked = false;
    let uncertainRetryChecked = false;
    const decisions = [];
    await page.route(`**/api/activity-programs/sessions/${job.playSessionId}/actions`, async route => {
      await route.fetch(); // The real server commits; only its browser response is lost.
      await route.abort("connectionfailed");
    }, { times: 1 });
    async function takeAvailableHelp() {
      if (helped || current.status === "completed") return;
      const hint = page.getByRole("button", { name: /^(Get a hint|Show me an example|Give me a cue)$/ }).first();
      if (await hint.count() && await hint.isEnabled()) {
        await hint.click();
        await expect.poll(async () => (await world(page, current.id)).assistance.received).toBe(true);
        current = await world(page, current.id);
        helped = true;
      }
    }
    await takeAvailableHelp();
    for (const step of job.publicPlan) {
      if (current.status === "completed") break;
      const action = current.actions.find(value => value.id === step.actionId);
      expect(action).toBeTruthy();
      const move: PublicMove = { actionId: step.actionId, inputs: Object.entries(step.inputs).map(([key, value]) => ({
        name: key, kind: typeof value === "number" ? "integer" : "text", integer: typeof value === "number" ? value : null,
        text: typeof value === "string" ? value : null,
      })) };
      const accepted = page.waitForRequest(request => request.url().endsWith(`/sessions/${job.playSessionId}/actions`) && request.method() === "POST");
      const before = current;
      current = await visibleMove(page, current, move);
      if (["assemble_product", "replace_text", "revise_text"].includes(action!.operation)) {
        const component = current.components.find(item => item.id === action!.componentId);
        const object = current.objects.find(item => component?.objectIds.includes(item.id)
          && item.kind === (action!.operation === "assemble_product" ? "equation" : "text_artifact"));
        expect(object).toBeTruthy();
        for (const [port, value] of Object.entries(step.inputs)) expect(current.state[object!.bindings[port]]).toEqual(value);
      }
      const command = (await accepted).postDataJSON();
      if (!uncertainRetryChecked) {
        const retry = page.getByRole("button", { name: "Retry saving the same move", exact: true });
        await expect(retry).toBeVisible();
        await retry.click();
        await expect(retry).toHaveCount(0);
        expect(await world(page, current.id)).toEqual(current);
        uncertainRetryChecked = true;
      }
      if (!duplicateChecked) {
        const account = await (await page.request.get("/api/auth/session")).json();
        const headers = { Origin: ORIGIN, "X-CSRF-Token": await csrf(page.request), "X-Sidekick-Profile-Version": String(account.version) };
        const duplicate = await page.request.post(`/api/activity-programs/sessions/${current.id}/actions`, { data: command, headers });
        expect(duplicate.ok()).toBeTruthy();
        expect(await duplicate.json()).toEqual(current);
        duplicateChecked = true;
      }
      await takeAvailableHelp();
      if (!refreshed && current.status !== "completed" && current.actionCount >= 2) {
        await page.reload();
        await expect(page.getByRole("region", { name: "Playable world", exact: true })).toBeVisible();
        expect(await world(page, current.id)).toEqual(current);
        refreshed = true;
      }
      const summarize = (session: ProgramSession) => ({
        connections: session.stageView?.connections.map(item => ({ id: item.id, open: item.open })),
        entities: session.stageView?.entities.map(item => ({ id: item.id, locationId: item.locationId, status: item.currentStatus, reaction: item.reactionText })),
        surfaces: session.stageView?.surfaces?.map(item => ({ id: item.id, selected: item.cells.filter(cell => cell.selected).map(cell => cell.id) })),
        fractions: session.fractionViews?.map(item => ({ objectId: item.objectId, numerator: item.numerator, denominator: item.denominator })),
        artifacts: session.objects.filter(item => ["equation", "evidence_board", "text_artifact"].includes(item.kind)).map(item => ({
          objectId: item.id, kind: item.kind, values: Object.fromEntries(Object.entries(item.bindings).map(([port, ref]) => [port, session.state[ref]])),
        })),
      });
      decisions.push({ operation: action!.operation, purpose: step.purpose || "progress", caption: step.caption || "",
        before: summarize(before), after: summarize(current), completed: current.status === "completed",
        publicStateChanged: JSON.stringify(before.state) !== JSON.stringify(current.state) });
      if (["experiment", "alternative", "recovery"].includes(step.purpose || "")) {
        await page.screenshot({ path: path.join(artifacts, `${name}-${step.purpose}.png`), fullPage: true });
      }
      await page.waitForTimeout(350); // Allow the accepted world change to remain visible in the short recording.
    }
    expect(current.status).toBe("completed");
    expect(current.definitionHash).toBe(expectedHash);
    expect(helped, "Exercise optional durable help before finishing").toBe(true);
    const experiment = decisions.findIndex(item => ["experiment", "alternative"].includes(item.purpose));
    expect(experiment).toBeGreaterThanOrEqual(0);
    expect(decisions[experiment].publicStateChanged).toBe(true);
    expect(decisions[experiment].completed).toBe(false);
    expect(decisions.findIndex((item, index) => index > experiment && item.purpose === "recovery" && item.publicStateChanged)).toBeGreaterThan(experiment);
    await expect(page.getByRole("heading", { name: "Mission complete", exact: true })).toBeVisible();
    await page.screenshot({ path: path.join(artifacts, `${name}-complete.png`), fullPage: true });
    await page.reload();
    await expect(page.getByRole("heading", { name: "Mission complete", exact: true })).toBeVisible();
    expect(await world(page, current.id)).toEqual(current);
    const account = await (await page.request.get("/api/auth/session")).json();
    const replay = await page.request.post(`/api/activity-programs/sessions/${current.id}/replay`, { data: { expectedRevision: current.revision },
      headers: { Origin: ORIGIN, "X-CSRF-Token": await csrf(page.request), "X-Sidekick-Profile-Version": String(account.version) } });
    expect(replay.ok()).toBeTruthy();
    expect((await replay.json()).verified).toBe(true);
    const other = await browser.newContext({ baseURL: ORIGIN, storageState: { cookies: [], origins: [] } });
    try {
      await createFamily(other);
      expect((await other.request.get(`/api/activity-programs/sessions/${current.id}`)).status()).toBe(404);
      const foreign = await (await other.request.get("/api/auth/session")).json();
      const blocked = await other.request.post(`/api/activity-programs/sessions/${current.id}/replay`, {
        data: { expectedRevision: current.revision }, headers: { Origin: ORIGIN, "X-CSRF-Token": await csrf(other.request),
          "X-Sidekick-Profile-Version": String(foreign.version) },
      });
      expect(blocked.status()).toBe(404);
    } finally { await other.close(); }
    const untouched = await world(page, job.sessionId);
    expect(untouched.actionCount).toBe(0);
    expect(untouched.revision).toBe(0);
    expect(untouched.assistance.received).toBe(false);
    expect(untouched.definitionHash).toBe(expectedHash);
    expect(untouched).toEqual(pristine);
    expect(errors).toEqual([]);
    verified = { browserCompleted: true, browserAttemptStatus: "passed", browserActionCount: current.actionCount, browserAssessment: current.outcome.assessment,
      browserAssisted: current.outcome.assisted, refreshVerified: true, midActivityRefreshVerified: refreshed, completedRefreshVerified: true, duplicateActionVerified: duplicateChecked,
      uncertainResponseRetryVerified: uncertainRetryChecked,
      replayVerified: true, ownershipVerified: true, untouchedStartingAttemptVerified: true,
      browserDefinitionHash: current.definitionHash, engineeringDecisions: decisions,
      screenshots: [`${name}-desktop.png`, `${name}-mobile.png`, `${name}-complete.png`], recording: `${name}.webm` };
    await page.waitForTimeout(1000);
  } finally {
    if (pointerDiagnostics) {
      const events = await page.evaluate(() => (window as Window & { sidekickPointerDiagnostics?: Record<string, unknown>[] }).sidekickPointerDiagnostics || []).catch(() => []);
      await writeFile(`/tmp/sidekick-game-${name}-pointer-diagnostics.json`, JSON.stringify({ events, requests: requestDiagnostics }, null, 2));
    }
    const video = page.video();
    await context.close();
    if (video) {
      const original = await video.path();
      await copyFile(original, path.join(artifacts, `${name}.webm`));
      await unlink(original);
    }
  }
  if (verified) await updateReport(name, verified);
});
