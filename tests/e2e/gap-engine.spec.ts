import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { test, expect, type Page } from "@playwright/test";
import { createFamily, mutate, PIN } from "./helpers";

const execute = promisify(execFile);

async function homeworkFixture(kidId: string) {
  const database = process.env.SIDEKICK_E2E_DATABASE_URL;
  expect(
    database,
    "Playwright must provide its isolated database URL",
  ).toBeTruthy();
  const { stdout } = await execute("backend/.venv/bin/python", [
    "tests/e2e/gap_fixture.py",
    database!,
    kidId,
  ]);
  return JSON.parse(stdout) as {
    subskillId: string;
    name: string;
    assignmentCount: number;
    chainCount: number;
  };
}

async function enterParent(page: Page) {
  await page.goto("/profiles");
  await page.getByRole("button", { name: /Parent.*PIN protected/ }).click();
  await page.getByLabel("Parent PIN", { exact: true }).fill(PIN);
  await page
    .getByRole("button", { name: "Enter parent mode", exact: true })
    .click();
  await expect(page).toHaveURL(/\/parent\/dashboard$/);
}

test("one incorrect student work response suggests support without assigning a diagnostic or practice", async ({
  page,
  context,
}) => {
  const family = await createFamily(context);
  const fixture = await homeworkFixture(family.kid.id);
  expect(fixture.assignmentCount).toBe(0);
  expect(fixture.chainCount).toBe(0);
  await mutate(context.request, "/api/session/picker");
  await enterParent(page);
  await page
    .getByRole("searchbox", { name: "Find a skill" })
    .fill(fixture.name);
  const card = page
    .locator(".skill-card")
    .filter({
      has: page.getByRole("heading", { name: fixture.name, exact: true }),
    })
    .first();
  await expect(card.getByText("Needs support", { exact: true })).toBeVisible();
  await card.getByText("See work observations", { exact: true }).click();
  await expect(
    card.getByText("Uploaded evidence (1)", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Send extra practice", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Try this together", exact: true }),
  ).toHaveCount(0);
  await expect(page.getByText("Steps checked", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Practicing now:", { exact: true })).toHaveCount(
    0,
  );
  const dashboard = await (
    await context.request.get(`/api/learning/parent/${family.kid.id}/dashboard`)
  ).json();
  expect(dashboard.sample).toBe(false);
  expect(
    dashboard.skills.find(
      (skill: { id: string }) => skill.id === fixture.subskillId,
    ).status,
  ).toBe("needs_support");
  expect(
    (
      await mutate(
        context.request,
        `/api/learning/parent/${family.kid.id}/extra-practice`,
        { subskillId: fixture.subskillId },
      )
    ).status(),
  ).toBe(410);
  expect(
    (
      await context.request.get(`/api/learning/parent/${family.kid.id}/adult`)
    ).status(),
  ).toBe(410);
  expect(
    (
      await mutate(
        context.request,
        `/api/learning/parent/${family.kid.id}/adult/submit`,
        {},
      )
    ).status(),
  ).toBe(410);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("child uploads remain available while the old practice URL and APIs cannot start questions", async ({
  page,
  context,
}) => {
  await createFamily(context);
  const legacyRequests: string[] = [];
  page.on("request", (request) => {
    if (/\/api\/learning\/kid\/(next|submit|session\/)/.test(request.url()))
      legacyRequests.push(request.url());
  });
  await page.goto("/kid");
  await expect(
    page.getByRole("link", { name: /Upload work/ }),
  ).toBeVisible();
  await expect(
    page.getByText("Add a worksheet, quiz, test, or other Math or ELA work.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator('a[href="/kid/practice"]')).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Practice my skills", exact: true }),
  ).toHaveCount(0);
  await page.goto("/kid/practice");
  await expect(page).toHaveURL(/\/kid$/);
  await expect(
    page.getByRole("link", { name: /Upload work/ }),
  ).toBeVisible();
  await expect(page.locator(".learning-item")).toHaveCount(0);
  expect(legacyRequests).toEqual([]);
  for (const endpoint of [
    "/api/learning/kid/next",
    "/api/learning/kid/submit",
    "/api/learning/kid/session/retired/activity",
  ]) {
    const response = await mutate(context.request, endpoint);
    expect(response.status()).toBe(410);
    expect((await response.json()).error.code).toBe("feature_removed");
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("parent uploads show saved processing progress, authorize the private original, and support deletion", async ({
  page,
  context,
}) => {
  const family = await createFamily(context);
  await mutate(context.request, "/api/session/picker");
  await enterParent(page);
  await page.getByRole("button", { name: "Student work", exact: true }).click();
  const base = `/api/learning/parent/${family.kid.id}/uploads`;
  const saved = page.waitForResponse(
    (response) =>
      response.url().endsWith(base) && response.request().method() === "POST",
  );
  await page
    .getByLabel("Upload work", { exact: true })
    .setInputFiles(
      path.join(process.cwd(), "public/samples/math-worksheet.png"),
    );
  const savedResponse = await saved;
  expect(savedResponse.status()).toBe(200);
  const upload = await savedResponse.json();
  expect(["pending", "processing", "completed"]).toContain(upload.state);
  await expect(
    page.getByRole("heading", { name: "Work processing", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Here’s your work.", exact: true }),
  ).toBeVisible();
  const privateFile = `${base}/${upload.id}/file`;
  await expect(
    page.getByRole("link", { name: "Open private original", exact: true }),
  ).toHaveAttribute("href", privateFile);
  const original = await context.request.get(privateFile);
  expect(original.status()).toBe(200);
  expect(original.headers()["cache-control"]).toContain("no-store");
  expect(original.headers()["content-type"]).toContain("image/png");
  await page.getByRole("button", { name: "Analytics", exact: true }).click();
  await expect(page.locator(".metric-card strong")).toHaveText(["4", "0", "4"]);
  await page.getByRole("button", { name: "Student work", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Delete upload", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const hiddenInputSize = await page
    .locator(".upload-file-label input")
    .evaluate((input) => {
      const { width, height } = input.getBoundingClientRect();
      return { width, height };
    });
  expect(hiddenInputSize.width).toBeLessThanOrEqual(1);
  expect(hiddenInputSize.height).toBeLessThanOrEqual(1);
  const siblingResponse = await mutate(
    context.request,
    "/api/parent/profiles",
    { firstName: "Maya", grade: "1", avatarKey: "owl" },
  );
  const sibling = await siblingResponse.json();
  expect(
    (
      await context.request.get(
        `/api/learning/parent/${sibling.id}/uploads/${upload.id}/file`,
      )
    ).status(),
  ).toBe(404);
  await page
    .getByRole("button", { name: "Delete upload", exact: true })
    .click();
  await expect(
    page.getByRole("alertdialog", { name: "Delete uploaded work" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Confirm delete upload", exact: true })
    .click();
  await expect(
    page.getByText("No work has been uploaded for this child yet.", {
      exact: true,
    }),
  ).toBeVisible();
  expect((await context.request.get(privateFile)).status()).toBe(404);
});
