import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import { expect, test } from "@playwright/test";
import { createFamily, mutate, PIN } from "./helpers";

const execute = promisify(execFile);

function keys(value: unknown): string[] {
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap(keys);
  return Object.entries(value).flatMap(([key, item]) => [key, ...keys(item)]);
}

for (const subject of ["math", "ela"] as const) {
  test(`${subject} creates a new activity outside the original library and saves the independent result`, async ({
    page,
    context,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const family = await createFamily(context);
    await page.goto("/kid/homework");
    await page.getByLabel("Choose work image", { exact: true }).setInputFiles(
      path.join(process.cwd(), `public/samples/activity-${subject}-general-work.png`),
    );
    const extracted = page.waitForResponse((response) =>
      response.url().endsWith("/api/extract") && response.request().method() === "POST",
    );
    await page.getByRole("button", { name: "Read my work", exact: true }).click();
    const uploadResponse = await extracted;
    expect(uploadResponse.status()).toBe(200);
    const uploadId = uploadResponse.headers()["x-sidekick-upload-id"];
    expect(uploadId).toBeTruthy();
    await expect(page.getByRole("heading", { name: "Here’s your work.", exact: true })).toBeVisible();
    await execute("backend/.venv/bin/python", [
      "tests/e2e/general_activity_fixture.py",
      process.env.SIDEKICK_E2E_DATABASE_URL!,
      family.kid.id,
      uploadId,
    ]);
    const launch = page.getByRole("button", { name: "Try an activity", exact: true });
    await expect(launch).toBeVisible();
    await expect(page.getByText("Right now, activities cover equal-part fractions and plural words.", { exact: false })).toHaveCount(0);

    const startKeys: string[] = [];
    page.on("request", (request) => {
      if (request.url().endsWith("/api/activities/kid/start") && request.method() === "POST")
        startKeys.push(request.postDataJSON().idempotencyKey);
    });
    if (subject === "ela") {
      let failed = false;
      await page.route("**/api/activities/kid/start", async (route) => {
        if (failed) return route.continue();
        failed = true;
        await route.fulfill({
          status: 503,
          contentType: "application/json",
          body: JSON.stringify({ error: {
            code: "activity_unavailable",
            message: "We couldn’t prepare an activity right now. Please try again.",
          } }),
        });
      });
      await launch.click();
      await expect(page.getByRole("region", { name: "Suggested learning activity" }).getByRole("alert"))
        .toContainText("We couldn’t prepare an activity right now.");
      await expect(launch).toBeEnabled();
    }
    const started = page.waitForResponse((response) =>
      response.url().endsWith("/api/activities/kid/start") && response.status() === 200,
    );
    await launch.click();
    const session = await (await started).json();
    if (subject === "ela") {
      expect(startKeys).toHaveLength(2);
      expect(startKeys[0]).toBe(startKeys[1]);
    }
    expect(session.origin).toBe("model_generated");
    expect(session.targetSkill.id).toBe(subject === "math" ? "4.OA.A.2-1" : "RI.3.1-1");
    expect(session.sceneCount).toBe(3);
    expect(session.currentScene.component).toBe("guided_choice");
    expect(keys(session).filter((key) =>
      ["answer", "acceptedAnswers", "comparison", "gradingSpec", "expected", "scenes", "nextSceneId"].includes(key),
    )).toEqual([]);
    await expect(page).toHaveURL(new RegExp(`/kid/activities/${session.id}$`));
    await expect(page.getByText("Generated activity", { exact: true })).toBeVisible();
    await expect(page.getByRole("region", { name: "Learning tip", exact: true })).toBeVisible();
    await page.getByRole("radio", {
      name: subject === "math" ? "5 × 3" : "They keep birds warm",
      exact: true,
    }).check();
    await page.getByRole("button", { name: "Check it", exact: true }).click();
    await page.getByRole("button", { name: "Show a hint", exact: true }).click();
    await expect(page.getByRole("complementary", { name: "Learning hint", exact: true })).toBeVisible();
    await page.screenshot({ path: test.info().outputPath(`generic-guided-${subject}.png`), fullPage: true });
    await page.reload();
    await expect(page.getByRole("button", { name: "Next", exact: true })).toBeEnabled();
    await expect(page.getByRole("complementary", { name: "Learning hint", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Next", exact: true }).click();

    const response = page.getByLabel("Your answer", { exact: true });
    await expect(response).toHaveJSProperty("tagName", "TEXTAREA");
    await expect(page.getByRole("region", { name: "Learning tip", exact: true })).toBeVisible();
    await response.fill(subject === "math" ? "20" : "pollen");
    await page.getByRole("button", { name: "Check it", exact: true }).click();
    await page.reload();
    await expect(response).toHaveValue(subject === "math" ? "20" : "pollen");
    await page.getByRole("button", { name: "Next", exact: true }).click();

    await expect(page.getByText("Try this on your own", { exact: true })).toBeVisible();
    await expect(page.getByRole("region", { name: "Learning tip", exact: true })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Show a hint", exact: true })).toHaveCount(0);
    await expect(page.getByRole("radio")).toHaveCount(0);
    if (subject === "ela")
      await expect(page.getByRole("region", { name: "Information for this step", exact: true })).toContainText(/otters/i);
    await page.screenshot({ path: test.info().outputPath(`generic-independent-${subject}.png`), fullPage: true });
    const answer = subject === "math" ? "42" : "air";
    await page.getByLabel("Your answer", { exact: true }).fill(answer);
    await page.getByRole("button", { name: "Save my answer", exact: true }).click();
    await expect(page.getByText("ACTIVITY COMPLETE", { exact: true })).toBeVisible();
    const finished = await (await context.request.get(`/api/activities/kid/sessions/${session.id}`)).json();
    expect(finished.finalResult.correct).toBe(true);
    expect(finished.finalResult.response).toBe(answer);
    expect(finished.currentScene).toBeNull();
    expect((await context.request.get(`/api/activities/parent/${family.kid.id}/history`)).status()).toBe(403);

    await mutate(context.request, "/api/session/picker");
    await page.goto("/profiles");
    await page.getByRole("button", { name: /Parent.*PIN protected/ }).click();
    await page.getByLabel("Parent PIN", { exact: true }).fill(PIN);
    await page.getByRole("button", { name: "Enter parent mode", exact: true }).click();
    await page.getByRole("button", { name: "Activities", exact: true }).click();
    await expect(page.getByRole("heading", { name: session.title, exact: true })).toBeVisible();
    await expect(page.getByText(answer, { exact: true })).toBeVisible();
    const history = await (await context.request.get(`/api/activities/parent/${family.kid.id}/history`)).json();
    expect(history.activities).toHaveLength(1);
    expect(history.activities[0].origin).toBe("model_generated");
    expect(history.activities[0].targetSkill.id).toBe(session.targetSkill.id);
    expect(history.activities[0].finalResult.correct).toBe(true);
    if (subject === "ela") {
      expect(history.activities[0].finalResult.question).toMatch(/otters/i);
      await expect(page.locator(".activity-history-result")).toContainText(/otters/i);
    }
    const dashboard = await (await context.request.get(`/api/learning/parent/${family.kid.id}/dashboard`)).json();
    const skill = dashboard.skills.find((item: { id: string }) => item.id === session.targetSkill.id);
    expect(skill).toBeTruthy();
    expect(["unassessed", "on_track"]).toContain(skill.status);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}
