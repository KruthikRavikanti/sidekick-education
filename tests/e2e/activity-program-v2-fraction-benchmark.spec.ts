/** Play the actual AI definition from public state; never read its witness. */
import { expect, test, type Locator, type Page } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { csrf, ORIGIN } from "./helpers";
import { world } from "./activity_program_public_driver";

async function savedClick(page: Page, id: string, button: Locator) {
  const before = await world(page, id);
  await button.click();
  await expect.poll(async () => (await world(page, id)).revision).toBeGreaterThan(before.revision);
  return world(page, id);
}

async function shadedArea(window: Locator) {
  return window.locator('[data-fraction-piece][data-fraction-shaded="true"]').evaluateAll(elements =>
    elements.reduce((sum, element) => {
      const box = element.getBoundingClientRect();
      return sum + box.width * box.height;
    }, 0));
}

test("saved AI filter supports construction, moves, different partitions, help, refresh and replay", async ({ page }) => {
  test.skip(process.env.SIDEKICK_RUN_FRACTION_BENCHMARK !== "true", "Explicit local benchmark verification only");
  expect(process.env.SIDEKICK_BENCHMARK_BROWSER_STATE).toBeTruthy();
  const folder = path.join(process.cwd(), "docs/activity-engine-v2-fraction-benchmark");
  const reportFile = path.join(folder, "report.json");
  const report = JSON.parse(await readFile(reportFile, "utf8"));
  expect(report.separateReviewApproved).toBe(true);
  expect(report.reviewHashBound).toBe(true);
  expect(report.verificationIsolation).toBe("synthetic_separate_database");
  const originalId = report.verificationPristineId;
  const previewUrl = `/kid/activity-preview/${originalId}`;
  const pristine = await world(page, originalId);
  expect(pristine.status).toBe("in_progress");
  expect(pristine.actionCount).toBe(0);
  expect(pristine.revision).toBe(0);
  await mkdir(folder, { recursive: true });
  await page.goto(previewUrl);
  await expect(page.getByRole("region", { name: "Fraction workspace", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: pristine.title, exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: path.join(folder, "01-ready-mobile.png"), fullPage: true });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.screenshot({ path: path.join(folder, "01-ready-desktop.png"), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });

  const outcomes: Record<string, unknown>[] = [];
  for (const [index, attempt] of report.verificationAttempts.entries()) {
    const id = attempt.id;
    let current = await world(page, id);
    expect(current.actionCount).toBe(0);
    expect(current.definitionHash).toBe(pristine.definitionHash);
    expect(current.components.map(item => item.kind)).toEqual(["fraction_workspace"]);
    const reference = current.fractionViews!.find(item => !item.editable)!;
    const candidate = current.fractionViews!.find(item => item.editable)!;
    expect(reference.numerator).toBe(2);
    expect(reference.denominator).toBe(5);
    expect(candidate.numerator).toBe(0);
    const partition = current.actions.find(item => item.operation === "set_fraction_partition")!
      .inputs.find(item => item.id === "denominator")!;
    const alternatives = Array.from({ length: partition.maximum! - partition.minimum! + 1 }, (_, part) => partition.minimum! + part)
      .filter(value => value > reference.denominator && value % candidate.width === 0
        && value % reference.denominator === 0);
    expect(alternatives.length).toBeGreaterThanOrEqual(2);
    await page.goto(`/kid/activity-preview/${id}`);
    const work = page.getByRole("figure", { name: "Your window", exact: true });
    const target = page.getByRole("figure", { name: "Target window", exact: true });
    await expect(work).toBeVisible();
    await expect(page.getByRole("button", { name: `Make ${alternatives[0]} equal parts`, exact: true })).toBeDisabled();
    const gridBox = await work.locator("[data-fraction-grid]").boundingBox();
    const targetBox = await target.locator("[data-fraction-grid]").boundingBox();
    expect(gridBox!.width).toBeCloseTo(targetBox!.width, 1);
    expect(gridBox!.height).toBeCloseTo(targetBox!.height, 1);

    if (index === 0) {
      current = await savedClick(page, id, page.getByRole("button", { name: "Get a hint", exact: true }).first());
      expect(current.assistance.received).toBe(true);
      current = await savedClick(page, id, work.getByRole("button", { name: "Place piece 1", exact: true }));
      expect(current.fractionViews!.find(item => item.editable)!.numerator).toBe(1);
      current = await savedClick(page, id, work.getByRole("button", { name: "Place piece 2", exact: true }));
      expect(current.status).toBe("in_progress"); // Same amount alone is insufficient.
      // A keyboard move and a touch-friendly two-tap move both change the
      // actual layout without changing the numerator or total covered area.
      const beforeKeyboard = current.revision;
      await work.getByRole("button", { name: "Lift piece 2", exact: true }).focus();
      await page.keyboard.press("ArrowRight");
      await expect.poll(async () => (await world(page, id)).revision).toBeGreaterThan(beforeKeyboard);
      current = await world(page, id);
      expect(current.fractionViews!.find(item => item.editable)!.pieces).toContain("p2");
      expect(current.fractionViews!.find(item => item.editable)!.numerator).toBe(2);
      await page.getByRole("button", { name: "Move pieces", exact: true }).click();
      await work.getByRole("button", { name: "Select piece 1 to move", exact: true }).click();
      current = await savedClick(page, id, work.getByRole("button", { name: "Place piece 5 here", exact: true }));
      expect(current.fractionViews!.find(item => item.editable)!.numerator).toBe(2);
      const beforeRefresh = current;
      await page.reload();
      await expect(work).toBeVisible();
      expect(await world(page, id)).toEqual(beforeRefresh);
      await page.getByRole("button", { name: "Compare the windows", exact: true }).click();
      await page.screenshot({ path: path.join(folder, "02-built-and-compared.png"), fullPage: true });
      const beforeArea = await shadedArea(work);
      expect(beforeArea).toBeGreaterThan(0);
      current = await savedClick(page, id, page.getByRole("button", { name: `Make ${alternatives[0]} equal parts`, exact: true }));
      const changed = current.fractionViews!.find(item => item.editable)!;
      expect(changed.denominator).toBe(alternatives[0]);
      expect(changed.numerator * reference.denominator).toBe(reference.numerator * changed.denominator);
      await expect(work).toHaveAttribute("data-denominator", String(changed.denominator));
      const afterArea = await shadedArea(work);
      expect(Math.abs(afterArea - beforeArea)).toBeLessThan(2);
    } else {
      // A second child-built arrangement and a different common-factor split.
      // The plan is derived from visible fractions, not admission keys.
      const denominator = alternatives[1];
      const order = [5, 3, 1, 4, 2];
      for (const piece of order.slice(0, reference.numerator)) {
        current = await savedClick(page, id, work.getByRole("button", { name: `Place piece ${piece}`, exact: true }));
      }
      expect(current.status).toBe("in_progress");
      expect(current.fractionViews!.find(item => item.editable)!.allowedDenominators).toContain(denominator);
      current = await savedClick(page, id, page.getByRole("button", { name: `Make ${denominator} equal parts`, exact: true }));
      expect(current.assistance.received).toBe(false);
    }
    expect(current.status).toBe("completed");
    expect(current.outcome.assessment).toBe("demonstrated");
    await expect(page.getByRole("heading", { name: "Mission complete", exact: true })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("heading", { name: "Mission complete", exact: true })).toBeVisible();
    expect(await world(page, id)).toEqual(current);
    const profile = await (await page.request.get("/api/auth/session")).json();
    const response = await page.request.post(`/api/activity-programs/sessions/${id}/replay`, {
      data: { expectedRevision: current.revision }, headers: {
        Origin: ORIGIN, "X-CSRF-Token": await csrf(page.request), "X-Sidekick-Profile-Version": String(profile.version),
      },
    });
    expect(response.ok()).toBe(true);
    expect((await response.json()).verified).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: path.join(folder, `03-complete-route-${index + 1}.png`), fullPage: true });
    const result = current.fractionViews!.find(item => item.editable)!;
    outcomes.push({ denominator: result.denominator, numerator: result.numerator,
      actions: current.actionCount, assisted: current.outcome.assisted, assessment: current.outcome.assessment,
      refreshVerified: true, replayVerified: true, differentLayoutsAndPartitions: true,
      matchingWholeDimensionsVerified: true, refinementGuardVerified: true,
      ...(index === 0 ? { shadedAreaPreserved: true, touchAndKeyboardMoveVerified: true } : {}) });
  }
  expect(await world(page, originalId)).toEqual(pristine);
  await page.goto(previewUrl);
  await expect(page.getByRole("region", { name: "Fraction workspace", exact: true })).toBeVisible();
  report.browserVerified = true;
  report.verificationPristineUntouched = true;
  report.verificationOutcomes = outcomes;
  await writeFile(reportFile, JSON.stringify(report, null, 2) + "\n");
});
