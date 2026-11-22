/** Explicit real-provider engineering proof; never part of the stubbed test suite. */
import { expect, test } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createFamily, mutate, PASSWORD } from "./helpers";
import { playPublicWorld, world } from "./activity_program_public_driver";

const execute = promisify(execFile);
async function inspect(generation?: string, resume = false) {
  const args = ["scripts/inspect_activity_program_proof.py", process.env.SIDEKICK_E2E_DATABASE_URL!];
  if (generation) args.push("--generation", generation);
  if (resume) args.push("--resume");
  const { stdout } = await execute("backend/.venv/bin/python", args, { env: { ...process.env, SIDEKICK_RUN_V2_LIVE: "true" } });
  return JSON.parse(stdout);
}

const captureOnly = process.env.SIDEKICK_V2_LIVE_CAPTURE_ONLY === "true";
test(captureOnly ? "recapture saved synthetic worlds without provider calls" : "real uploads compose, review and play new Math, reading and writing programs", async ({ page, context }) => {
  test.skip(process.env.SIDEKICK_RUN_V2_LIVE !== "true", "Explicit provider verification only");
  const folder = path.join(process.cwd(), "docs/activity-engine-v2-composition");
  const resume = process.env.SIDEKICK_V2_LIVE_RESUME === "true";
  if (captureOnly && !resume) throw new Error("Capture mode requires the original isolated proof database and report.");
  if (resume) {
    const family = await inspect(undefined, true);
    expect((await mutate(context.request, "/api/auth/login", { email: family.email, password: PASSWORD })).ok()).toBeTruthy();
    expect((await mutate(context.request, "/api/session/kid", { profileId: family.profileId })).ok()).toBeTruthy();
  } else {
    await createFamily(context, "3");
    expect(await inspect()).toEqual({ programVersions: 0, v1Versions: 0 });
  }
  const report: { syntheticEngineeringRun: boolean; success: boolean; cases: Record<string, unknown>[];
    externalBlocker?: { stage: string; reasonCode: string; providerHttpStatus: number } } = resume
    ? JSON.parse(await readFile(path.join(folder, "browser-live-report.json"), "utf8")) : {
    syntheticEngineeringRun: true, success: false, cases: [],
  };
  report.success = false;
  await mkdir(folder, { recursive: true });
  try {
    for (const [name, file] of [
      ["area-first", "activity-composed-area-work.png"],
      ["area-history", "activity-v2-area-correct-work.png"],
      ["reading", "activity-toolkit-evidence-work.png"],
      ["writing", "activity-catalog-writing-work.png"],
    ]) {
      if (captureOnly) continue;
      let record = report.cases.find(value => value.case === name);
      if (resume && record?.browserCompleted === true) continue;
      if (record?.reasonCode) {
        record.priorFailures = [...(Array.isArray(record.priorFailures) ? record.priorFailures : []),
          { stage: record.generationStage, reasonCode: record.reasonCode }];
      }
      if (!record) { record = { case: name }; report.cases.push(record); }
      Object.assign(record, { generated: false, reviewed: false, browserCompleted: false, assessedSuccess: false });
      await page.goto("/kid/homework");
      await page.getByLabel("Choose work image", { exact: true }).setInputFiles(path.join(process.cwd(), "public/samples", file));
      let extracted;
      for (let attempt = 0; attempt < 2; attempt++) {
        const upload = page.waitForResponse(response => response.url().endsWith("/api/extract") && response.request().method() === "POST", { timeout: 240_000 });
        await page.getByRole("button", { name: "Read my work", exact: true }).click();
        extracted = await upload;
        if (extracted.ok()) break;
        const error = await extracted.json();
        record.uploadFailures = [...(Array.isArray(record.uploadFailures) ? record.uploadFailures : []), error.error?.code || "upload_failed"];
      }
      if (!extracted) throw new Error("Synthetic upload was not submitted");
      expect(extracted.ok()).toBeTruthy();
      record.liveExtraction = (await extracted.json()).source === "live";
      const card = page.getByRole("region", { name: "Create a learning activity", exact: true });
      await expect(card.getByRole("button", { name: "Create an activity", exact: true })
        .or(card.getByRole("link", { name: "Review activity attempt", exact: true }))
        .or(card.getByRole("link", { name: "Open your activity", exact: true })).first()).toBeVisible({ timeout: 240_000 });
      let generationId: string;
      let alreadyReady = false;
      if (resume && await card.getByRole("link", { name: "Open your activity", exact: true }).count()) {
        const source = extracted.headers()["x-sidekick-upload-id"];
        const suggestion = await (await context.request.get(`/api/activity-programs/uploads/${source}/suggestion`)).json();
        generationId = suggestion.generation.id;
        await card.getByRole("link", { name: "Open your activity", exact: true }).click();
        alreadyReady = true;
      } else if (resume && await card.getByRole("link", { name: "Review activity attempt", exact: true }).count()) {
        await card.getByRole("link", { name: "Review activity attempt", exact: true }).click();
        const retried = page.waitForResponse(response => response.url().endsWith("/retry") && response.request().method() === "POST");
        await page.getByRole("button", { name: "Try creating again", exact: true }).click();
        const response = await retried;
        expect(response.status()).toBe(202);
        generationId = (await response.json()).id;
        record.explicitRetryVerified = true;
      } else {
        await expect(card.getByRole("button", { name: "Create an activity", exact: true })).toBeEnabled({ timeout: 240_000 });
        await card.getByRole("button", { name: "Create an activity", exact: true }).click();
        await expect(page).toHaveURL(/\/kid\/activity-preview\/generations\//, { timeout: 20_000 });
        generationId = page.url().split("/").at(-1)!;
      }
      if (!alreadyReady) {
        await expect(page).toHaveURL(new RegExp(`/kid/activity-preview/generations/${generationId}$`), { timeout: 20_000 });
        await page.reload(); // Refresh the accepted job, never its failed predecessor.
      }
      let job: { status: string; stage: string; reasonCode: string | null } | null = null;
      await expect.poll(async () => {
        job = await (await context.request.get(`/api/activity-programs/generations/${generationId}`)).json();
        return job?.status !== "processing";
      }, { timeout: 420_000, intervals: [1000, 2000] }).toBe(true);
      record.generationStage = job!.stage;
      record.reasonCode = job!.reasonCode;
      expect(job!.status, `Generation failed at ${job!.stage}: ${job!.reasonCode}`).toBe("ready");
      await expect(page).toHaveURL(/\/kid\/activity-preview\/[a-f0-9]+$/, { timeout: 20_000 });
      const id = page.url().split("/").at(-1)!;
      record.generated = job!.status === "ready";
      record.reviewed = job!.status === "ready"; // Admission requires a hash-bound separate review.
      Object.assign(record, await inspect(generationId));
      expect(record.approvalHashBound).toBe(true);
      expect(record.separateReviewApproved).toBe(true);
      const initial = await world(page, id);
      expect(initial.actionCount).toBe(0);
      expect(initial.revision).toBe(0);
      record.definitionHash = initial.definitionHash;
      record.operations = [...new Set(initial.actions.map(action => action.operation))].sort();
      await expect(page.getByText("Created for your learning · Development preview", { exact: true })).toBeVisible();
      const finished = await playPublicWorld(page, initial, name === "area-first");
      record.browserCompleted = true;
      record.assessment = finished.outcome.assessment;
      record.evidenceOutcomes = finished.outcome.evidence.map(item => ({ status: item.status, assisted: item.assisted }));
      record.assessedSuccess = finished.outcome.assessment === "demonstrated";
      record.assisted = finished.outcome.assisted;
      record.refreshRestored = true;
      record.replayVerified = true;
      if (name === "writing") expect(finished.outcome.assessment).toBe("pending_parent_review");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: path.join(folder, `${name}.png`), fullPage: true });
    }
    // Recapture resumed completed worlds with the final renderer, without any
    // new child actions or use of their private definitions/witnesses.
    const saved = await (await context.request.get("/api/activity-programs/generations")).json();
    for (const record of report.cases) {
      if (!record.browserCompleted) continue;
      for (const job of saved.generations) {
        if (!job.sessionId) continue;
        const session = await world(page, job.sessionId);
        if (session.definitionHash !== record.definitionHash) continue;
        await page.goto(`/kid/activity-preview/${session.id}`);
        await expect(page.getByRole("heading", { name: "Mission complete", exact: true })).toBeVisible();
        await page.screenshot({ path: path.join(folder, `${record.case}.png`), fullPage: true });
        record.finalRendererCaptured = true;
        break;
      }
    }
    expect(report.cases[0].operations).not.toEqual(report.cases[1].operations);
    expect(report.cases[0].assisted).toBe(true);
    expect(report.cases[1].priorAssistanceObserved).toBe(true);
    expect(report.cases[0].targetSkills).toEqual(report.cases[1].targetSkills);
    report.success = report.cases.length === 4 && report.cases.every(item => item.generated && item.reviewed && item.browserCompleted);
    if (report.success) delete report.externalBlocker;
    if (!captureOnly) expect(report.success).toBe(true);
  } finally {
    // Contains only fixed metrics and generated curriculum hashes, never IDs,
    // draft bodies, provider payloads, credentials or original schoolwork.
    await writeFile(path.join(folder, "browser-live-report.json"), JSON.stringify(report, null, 2) + "\n");
  }
});
