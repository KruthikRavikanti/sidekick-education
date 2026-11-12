import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { test, expect } from "@playwright/test";
import { createFamily, mutate, PIN } from "./helpers";

const execute = promisify(execFile);

function keys(value: unknown): string[] {
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap(keys);
  return Object.entries(value).flatMap(([key, item]) => [key, ...keys(item)]);
}

test("unsupported work explains why no activity is available while keeping extraction results", async ({
  page,
  context,
}) => {
  await createFamily(context);
  await page.route("**/api/activities/kid/suggestion?*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        available: false,
        reason: "no_supported_skill",
        targetSkill: null,
        sessionId: null,
      }),
    }),
  );
  await page.goto("/kid/homework");
  await page.getByLabel("Choose work image", { exact: true }).setInputFiles(
    path.join(process.cwd(), "public/samples/activity-math-work.png"),
  );
  const extracted = page.waitForResponse((response) =>
    response.url().endsWith("/api/extract") && response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Read my work", exact: true }).click();
  expect((await extracted).status()).toBe(200);

  const suggestion = page.getByRole("region", { name: "Suggested learning activity", exact: true });
  await expect(suggestion.getByRole("heading", { name: "No matching activity yet.", exact: true })).toBeVisible();
  await expect(suggestion.getByText(
    "We couldn’t reliably match this work to a supported activity. Right now, activities cover equal-part fractions and plural words.",
    { exact: true },
  )).toBeVisible();
  await expect(suggestion.getByRole("button", { name: "Try an activity", exact: true })).toHaveCount(0);
  await expect(suggestion.getByRole("button", { name: "Try again", exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Here’s your work.", exact: true })).toBeVisible();
  await expect(page.getByText("How many 1/4 pieces make 3/4?", { exact: true })).toBeVisible();
});

for (const [subject, correctness] of [
  ["math", "incorrect"],
  ["ela", "incorrect"],
  ["math", "correct"],
  ["ela", "correct"],
] as const) {
  test(`${subject} ${correctness === "correct" ? "all-correct" : "incorrect"} upload suggests an activity, saves guided play, and records a fresh independent answer`, async ({
    page,
    context,
  }) => {
    const family = await createFamily(context);
    await page.goto("/kid/homework");
    await page
      .getByLabel("Choose work image", { exact: true })
      .setInputFiles(
        path.join(process.cwd(), `public/samples/activity-${subject}${correctness === "correct" ? "-correct" : ""}-work.png`),
      );
    const extracted = page.waitForResponse(
      (response) =>
        response.url().endsWith("/api/extract") &&
        response.request().method() === "POST",
    );
    await page
      .getByRole("button", { name: "Read my work", exact: true })
      .click();
    const uploadResponse = await extracted;
    expect(uploadResponse.status()).toBe(200);
    const transcription = await uploadResponse.json();
    expect(transcription.problems).toHaveLength(1);
    expect(transcription.problems[0].student_work.final_answer.text).toBe(
      subject === "math"
        ? correctness === "correct" ? "3" : "4"
        : correctness === "correct" ? "mice" : "mouses",
    );
    const uploadId = uploadResponse.headers()["x-sidekick-upload-id"];
    expect(uploadId).toBeTruthy();
    await expect(
      page.getByRole("heading", { name: "Here’s your work.", exact: true }),
    ).toBeVisible();
    await execute("backend/.venv/bin/python", [
      "tests/e2e/activity_fixture.py",
      process.env.SIDEKICK_E2E_DATABASE_URL!,
      family.kid.id,
      uploadId,
      correctness,
    ]);
    const started = page.waitForResponse(
      (response) =>
        response.url().endsWith("/api/activities/kid/start") &&
        response.request().method() === "POST",
    );
    await page
      .getByRole("button", { name: "Try an activity", exact: true })
      .click();
    const session = await (await started).json();
    expect(
      keys(session).filter((key) =>
        ["answer", "gradingSpec", "expected", "scenes", "nextSceneId"].includes(
          key,
        ),
      ),
    ).toEqual([]);
    await expect(page).toHaveURL(new RegExp(`/kid/activities/${session.id}$`));
    await expect(
      page.getByText("Original Sidekick example", { exact: true }),
    ).toBeVisible();

    if (subject === "math") {
      await page
        .getByRole("button", { name: "Piece 1 of 4", exact: true })
        .click();
    } else {
      await page.getByRole("button", { name: "Add m", exact: true }).click();
    }
    if (subject === "math") {
      let interrupted = false;
      await page.route(
        "**/api/activities/kid/sessions/*/submit",
        async (route) => {
          if (interrupted) return route.continue();
          interrupted = true;
          await route.fetch();
          await route.abort("failed");
        },
      );
      await page.getByRole("button", { name: "Check it", exact: true }).click();
      await expect(page.getByRole("alert")).toBeVisible();
    }
    await page.getByRole("button", { name: "Check it", exact: true }).click();
    await page
      .getByRole("button", { name: "Show a hint", exact: true })
      .click();
    await expect(
      page.getByRole("complementary", { name: "Visual hint", exact: true }),
    ).toBeVisible();
    if (subject === "math")
      await page.screenshot({ path: test.info().outputPath("guided.png") });
    await page.reload();
    await expect(
      page.getByRole("button", { name: "Next", exact: true }),
    ).toBeEnabled();
    await expect(
      page.getByRole("complementary", { name: "Visual hint", exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Try again", exact: true }).click();
    if (subject === "math") {
      await page
        .getByRole("button", { name: "Piece 2 of 4", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Piece 3 of 4", exact: true })
        .click();
    } else {
      for (const letter of ["i", "c", "e"])
        await page
          .getByRole("button", { name: `Add ${letter}`, exact: true })
          .click();
    }
    await page.getByRole("button", { name: "Check it", exact: true }).click();
    await page.getByRole("button", { name: "Next", exact: true }).click();

    if (subject === "math") {
      const line = page.getByRole("slider", {
        name: "Place the fraction on the number line",
        exact: true,
      });
      await line.focus();
      for (let index = 0; index < 4; index++) await line.press("ArrowRight");
      await expect(line).toHaveAttribute("aria-valuetext", "4/6");
    } else {
      await page.getByRole("radio", { name: "men", exact: true }).check();
    }
    await page.getByRole("button", { name: "Check it", exact: true }).click();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await expect(
      page.getByText("Try this on your own", { exact: true }),
    ).toBeVisible();
    await expect(page.locator(".activity-manipulative")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Show a hint", exact: true }),
    ).toHaveCount(0);
    if (subject === "math")
      await page.screenshot({
        path: test.info().outputPath("independent.png"),
      });
    const answer = subject === "math" ? "3/8" : "feet";
    await page.getByLabel("Your answer", { exact: true }).fill(answer);
    await page
      .getByRole("button", { name: "Save my answer", exact: true })
      .click();
    await expect(
      page.getByText("ACTIVITY COMPLETE", { exact: true }),
    ).toBeVisible();
    const finished = await (
      await context.request.get(`/api/activities/kid/sessions/${session.id}`)
    ).json();
    expect(finished.finalResult.response).toBe(answer);
    expect(finished.finalResult.correct).toBe(true);
    expect(finished.currentScene).toBeNull();
    expect(
      (
        await context.request.get(
          `/api/activities/parent/${family.kid.id}/history`,
        )
      ).status(),
    ).toBe(403);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);

    await mutate(context.request, "/api/session/picker");
    await page.goto("/profiles");
    await page.getByRole("button", { name: /Parent.*PIN protected/ }).click();
    await page.getByLabel("Parent PIN", { exact: true }).fill(PIN);
    await page
      .getByRole("button", { name: "Enter parent mode", exact: true })
      .click();
    await page.getByRole("button", { name: "Activities", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: session.title, exact: true }),
    ).toBeVisible();
    await expect(page.getByText(answer, { exact: true })).toBeVisible();
    await expect(
      page.getByText("Guided hints used: 1", { exact: true }),
    ).toBeVisible();
    const history = await (
      await context.request.get(
        `/api/activities/parent/${family.kid.id}/history`,
      )
    ).json();
    expect(history.activities[0].finalResult.correct).toBe(true);
    const dashboard = await (
      await context.request.get(
        `/api/learning/parent/${family.kid.id}/dashboard`,
      )
    ).json();
    expect(
      dashboard.skills.find(
        (skill: { id: string }) => skill.id === session.targetSkill.id,
      ).status,
    ).toBe(correctness === "correct" ? "on_track" : "needs_support");
  });
}
