import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import { expect, test, type Locator } from "@playwright/test";
import { createFamily, mutate, PIN } from "./helpers";

const execute = promisify(execFile);

function keys(value: unknown): string[] {
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap(keys);
  return Object.entries(value).flatMap(([key, item]) => [key, ...keys(item)]);
}

async function wholeMeasurements(region: Locator) {
  return region.locator(".split-compare-whole").evaluateAll((wholes) =>
    wholes.map((whole) => {
      const shade = whole.querySelector('[data-testid="fraction-shaded-area"]')!;
      const wholeBox = whole.getBoundingClientRect();
      const shadeBox = shade.getBoundingClientRect();
      const style = getComputedStyle(whole);
      return {
        width: wholeBox.width,
        height: wholeBox.height,
        innerWidth: wholeBox.width - parseFloat(style.borderLeftWidth) - parseFloat(style.borderRightWidth),
        shadeWidth: shadeBox.width,
        shadeHeight: shadeBox.height,
        shadedFraction: shade.getAttribute("data-shaded-fraction"),
      };
    }),
  );
}

for (const finalAnswer of ["6/8", "3/4"] as const) {
  test(`equivalent fractions split equal pieces without changing shaded area and save ${finalAnswer} independently`, async ({
    page,
    context,
  }) => {
    const correct = finalAnswer === "6/8";
    const browserErrors: string[] = [];
    page.on("pageerror", (error) => browserErrors.push(error.message));
    await page.emulateMedia({ reducedMotion: correct ? "no-preference" : "reduce" });
    const family = await createFamily(context);
    await page.goto("/kid/homework");
    await page.getByLabel("Choose work image", { exact: true }).setInputFiles(
      path.join(process.cwd(), "public/samples/activity-equivalent-work.png"),
    );
    const extracted = page.waitForResponse((response) =>
      response.url().endsWith("/api/extract") && response.request().method() === "POST",
    );
    await page.getByRole("button", { name: "Read my work", exact: true }).click();
    const upload = await extracted;
    expect(upload.status()).toBe(200);
    const uploadId = upload.headers()["x-sidekick-upload-id"];
    expect(uploadId).toBeTruthy();
    await expect(page.getByRole("heading", { name: "Here’s your work.", exact: true })).toBeVisible();
    await execute("backend/.venv/bin/python", [
      "tests/e2e/equivalent_activity_fixture.py",
      process.env.SIDEKICK_E2E_DATABASE_URL!,
      family.kid.id,
      uploadId,
    ]);
    const started = page.waitForResponse((response) =>
      response.url().endsWith("/api/activities/kid/start") && response.status() === 200,
    );
    await page.getByRole("button", { name: "Try an activity", exact: true }).click();
    const session = await (await started).json();
    expect(session.targetSkill.id).toBe("3.NF.A.3-2");
    expect(session.currentScene.component).toBe("fraction_split_compare");
    expect(session.sceneCount).toBe(3);
    expect(keys(session).filter((key) => [
      "answer", "acceptedAnswers", "comparison", "expected", "scenes", "nextSceneId",
      "sourceNumerator", "sourceDenominator", "targetDenominator",
    ].includes(key))).toEqual([]);
    await expect(page).toHaveURL(new RegExp(`/kid/activities/${session.id}$`));

    const visual = page.getByRole("region", { name: "Split and compare fractions", exact: true });
    const check = page.getByRole("button", { name: "Check it", exact: true });
    await expect(visual).toBeVisible();
    await expect(visual).toHaveAttribute("data-split-factor", "1");
    await expect(check).toBeDisabled();
    const initial = await wholeMeasurements(visual);
    expect(initial).toHaveLength(2);
    expect(initial[0].width).toBe(initial[1].width);
    const shadeNodes = await visual.getByTestId("fraction-shaded-area").elementHandles();
    expect(shadeNodes).toHaveLength(2);

    async function expectSameShading() {
      const current = await wholeMeasurements(visual);
      for (const [index, measurement] of current.entries()) {
        expect(measurement.shadedFraction).toBe("1/2");
        expect(measurement.width).toBeCloseTo(initial[index].width, 5);
        expect(measurement.height).toBeCloseTo(initial[index].height, 5);
        expect(measurement.shadeWidth).toBeCloseTo(initial[index].shadeWidth, 5);
        expect(measurement.shadeHeight).toBeCloseTo(initial[index].shadeHeight, 5);
        expect(measurement.shadeWidth / measurement.innerWidth).toBeCloseTo(.5, 3);
        expect(await shadeNodes[index].evaluate((node, position) => {
          const region = document.querySelector('[aria-label="Split and compare fractions"]')!;
          return node.isConnected && region.querySelectorAll('[data-testid="fraction-shaded-area"]')[position] === node;
        }, index)).toBe(true);
      }
    }

    const halvesIntoTwo = visual.getByRole("radio", { name: "Split each part into 2 pieces", exact: true });
    await halvesIntoTwo.focus();
    await halvesIntoTwo.press("Space");
    await expect(visual).toHaveAttribute("data-split-factor", "2");
    await expect(visual.getByRole("img", { name: "Split whole: 2/4 shaded", exact: true }))
      .toHaveAttribute("data-partition-count", "4");
    await expect(visual.getByLabel("Equivalent fractions", { exact: true })).toHaveText("1/2 = 2/4");
    await expectSameShading();

    const halvesIntoThree = visual.getByRole("radio", { name: "Split each part into 3 pieces", exact: true });
    await halvesIntoThree.check();
    await expect(visual).toHaveAttribute("data-split-factor", "3");
    await expect(visual.getByRole("img", { name: "Split whole: 3/6 shaded", exact: true }))
      .toHaveAttribute("data-partition-count", "6");
    await expect(visual.getByLabel("Equivalent fractions", { exact: true })).toHaveText("1/2 = 3/6");
    await expect(visual).toContainText("The shaded amount stayed the same.");
    await expectSameShading();
    await expect(visual.locator(".split-compare-divider-animate").first())
      .toHaveCSS("animation-name", correct ? "split-compare-partition-in" : "none");

    await visual.getByRole("button", { name: "Start with original parts", exact: true }).click();
    await expect(visual).toHaveAttribute("data-split-factor", "1");
    await expect(check).toBeDisabled();
    await expectSameShading();
    await halvesIntoThree.check();
    await expectSameShading();
    await check.click();
    await page.getByRole("button", { name: "Show a hint", exact: true }).click();
    await expect(page.getByRole("complementary", { name: "Visual hint", exact: true })).toBeVisible();
    if (correct) await page.screenshot({ path: test.info().outputPath("equivalent-guided.png"), fullPage: true });

    await page.reload();
    await expect(visual).toHaveAttribute("data-split-factor", "3");
    await expect(halvesIntoThree).toBeChecked();
    await expect(visual.getByLabel("Equivalent fractions", { exact: true })).toHaveText("1/2 = 3/6");
    await expect(page.getByRole("button", { name: "Next", exact: true })).toBeEnabled();
    await page.getByRole("button", { name: "Try again", exact: true }).click();
    await expect(visual).toHaveAttribute("data-split-factor", "1");
    await expect(check).toBeDisabled();
    await halvesIntoThree.check();
    await check.click();
    await page.getByRole("button", { name: "Next", exact: true }).click();

    await expect(visual).toHaveAttribute("data-original-numerator", "2");
    await expect(visual).toHaveAttribute("data-original-denominator", "3");
    await visual.getByRole("radio", { name: "Split each part into 2 pieces", exact: true }).check();
    await expect(visual.getByLabel("Equivalent fractions", { exact: true })).toHaveText("2/3 = 4/6");
    await check.click();
    await page.getByRole("button", { name: "Next", exact: true }).click();

    await expect(page.getByRole("heading", { name: "Write 3/4 in eighths.", exact: true })).toBeVisible();
    await expect(page.getByText("Try this on your own", { exact: true })).toBeVisible();
    await expect(visual).toHaveCount(0);
    await expect(page.locator(".activity-manipulative")).toHaveCount(0);
    await expect(page.getByRole("region", { name: "Learning tip", exact: true })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Show a hint", exact: true })).toHaveCount(0);
    await expect(page.getByRole("radio")).toHaveCount(0);
    if (correct) await page.screenshot({ path: test.info().outputPath("equivalent-independent.png"), fullPage: true });
    await page.getByLabel("Your answer", { exact: true }).fill(finalAnswer);
    const saving = page.waitForRequest((request) =>
      request.url().includes(`/api/activities/kid/sessions/${session.id}/submit`) && request.method() === "POST",
    );
    await page.getByRole("button", { name: "Save my answer", exact: true }).click();
    const savedBody = (await saving).postDataJSON();
    await expect(page.getByText("ACTIVITY COMPLETE", { exact: true })).toBeVisible();
    const finished = await (await context.request.get(`/api/activities/kid/sessions/${session.id}`)).json();
    expect(finished.finalResult.response).toBe(finalAnswer);
    expect(finished.finalResult.correct).toBe(correct);
    expect(finished.currentScene).toBeNull();
    const submitPath = `/api/activities/kid/sessions/${session.id}/submit`;
    const sameRequest = await mutate(context.request, submitPath, savedBody);
    expect(sameRequest.status()).toBe(200);
    expect((await sameRequest.json()).finalResult).toEqual(finished.finalResult);
    const changedAnswer = await mutate(context.request, submitPath, {
      ...savedBody,
      idempotencyKey: `different-final-${Date.now()}`,
      response: correct ? "3/4" : "6/8",
    });
    expect(changedAnswer.status()).toBe(409);
    expect((await context.request.get(`/api/activities/parent/${family.kid.id}/history`)).status()).toBe(403);

    await mutate(context.request, "/api/session/picker");
    await page.goto("/profiles");
    await page.getByRole("button", { name: /Parent.*PIN protected/ }).click();
    await page.getByLabel("Parent PIN", { exact: true }).fill(PIN);
    await page.getByRole("button", { name: "Enter parent mode", exact: true }).click();
    await page.getByRole("button", { name: "Activities", exact: true }).click();
    await expect(page.getByRole("heading", { name: session.title, exact: true })).toBeVisible();
    const historyCard = page.locator(".activity-history-result");
    await expect(historyCard).toContainText("Write 3/4 in eighths.");
    await expect(historyCard.locator(".transcription")).toHaveText(finalAnswer);
    await expect(historyCard.getByText(correct ? "Correct" : "Incorrect", { exact: true })).toBeVisible();
    const history = await (await context.request.get(`/api/activities/parent/${family.kid.id}/history`)).json();
    expect(history.activities).toHaveLength(1);
    expect(history.activities[0].finalResult).toEqual(finished.finalResult);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(browserErrors).toEqual([]);
  });
}
