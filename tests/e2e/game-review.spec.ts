import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { test, expect, type Page } from "@playwright/test";
import { createFamily, mutate, PIN } from "./helpers";

const execute = promisify(execFile);

async function seedGames() {
  const database = process.env.SIDEKICK_E2E_DATABASE_URL;
  expect(database, "Playwright must provide its isolated database URL").toBeTruthy();
  const { stdout } = await execute("backend/.venv/bin/python", [
    "tests/e2e/game_review_fixture.py",
    database!,
  ]);
  return JSON.parse(stdout) as {
    waiting: number;
    counts: Record<string, number>;
    algebraTitle: string;
    algebraSkill: string;
  };
}

async function enterParent(page: Page) {
  await page.goto("/profiles");
  await page.getByRole("button", { name: /Parent.*PIN protected/ }).click();
  await page.getByLabel("Parent PIN", { exact: true }).fill(PIN);
  await page.getByRole("button", { name: "Enter parent mode", exact: true }).click();
  await expect(page).toHaveURL(/\/parent\/dashboard$/);
}

test("the review page filters, searches and pages a large game library, and approving moves a game to Live", async ({
  page,
  context,
}) => {
  await createFamily(context);
  const seeded = await seedGames();
  expect(seeded.waiting).toBeGreaterThan(50);
  await mutate(context.request, "/api/session/picker");
  await enterParent(page);
  // Reviewers reach the page from the dashboard, the way a person does. The link shows how many games are waiting.
  await page.getByRole("button", { name: "Games", exact: true }).click();
  await page.getByRole("link", { name: `Review games (${seeded.waiting})` }).click();
  await expect(page).toHaveURL(/\/parent\/games$/);
  await expect(page.getByRole("heading", { name: "Game review" })).toBeVisible();

  const list = page.getByRole("navigation", { name: "Games" });
  const status = list.getByRole("status");
  const total = seeded.waiting.toLocaleString();
  // The first page: 50 of everything that is waiting, kindergarten math first.
  await expect(status).toHaveText(`Showing 1 to 50 of ${total}`);
  await expect(list.getByRole("button", { name: /^Waiting/ })).toContainText(total);
  await expect(list.locator("button[aria-current], button:has(strong)")).toHaveCount(50);

  // Paging.
  await list.getByRole("button", { name: "Next" }).click();
  await expect(status).toHaveText(`Showing 51 to ${total} of ${total}`);
  await expect(list.getByRole("button", { name: "Next" })).toBeDisabled();
  await list.getByRole("button", { name: "Previous" }).click();
  await expect(status).toHaveText(`Showing 1 to 50 of ${total}`);

  // Subject and grade filters. High school shows under its own label.
  await list.getByLabel("Subject").selectOption("ela");
  await expect(status).toHaveText("Showing 1 to 4 of 4");
  await expect(list.locator("button small", { hasText: "Grades 9-10" })).toHaveCount(4);
  await list.getByLabel("Subject").selectOption("");
  await list.getByLabel("Grade").selectOption("Algebra 1");
  await expect(status).toHaveText("Showing 1 to 3 of 3");

  // Search by skill id, then nothing matches.
  await list.getByLabel("Grade").selectOption("");
  await list.getByLabel("Search games").fill(seeded.algebraSkill);
  await expect(list.getByRole("button", { name: new RegExp(seeded.algebraTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) })).toBeVisible();
  await list.getByLabel("Search games").fill("no such game anywhere");
  await expect(status).toHaveText("No games match these filters.");

  // Open the Algebra 1 game. It plays in the locked frame, and approving moves it to Live.
  await list.getByLabel("Search games").fill(seeded.algebraSkill);
  await list.getByRole("button", { name: new RegExp(seeded.algebraTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) }).click();
  await expect(page.getByRole("heading", { name: seeded.algebraTitle, level: 2 })).toBeVisible();
  await expect(page.locator("iframe").first()).toBeVisible();
  await page.getByRole("button", { name: "Approve for kids" }).click();
  await expect(page.getByText("Live for kids")).toBeVisible();
  await expect(list.getByRole("button", { name: /^Live/ })).toContainText("1");
  await list.getByLabel("Search games").fill("");
  await list.getByRole("button", { name: /^Live/ }).click();
  await expect(status).toHaveText("Showing 1 to 1 of 1");
  await list.getByRole("button", { name: /^Waiting/ }).click();
  await expect(status).toHaveText(`Showing 1 to 50 of ${(seeded.waiting - 1).toLocaleString()}`);
});

test("a model-written game shows the model reviewer's notes, and a build that stopped says why", async ({ page, context }) => {
  await createFamily(context);
  const database = process.env.SIDEKICK_E2E_DATABASE_URL;
  const { stdout } = await execute("backend/.venv/bin/python", ["tests/e2e/game_review_fixture.py", database!, "model"]);
  const made = JSON.parse(stdout) as { title: string; skill: string; stoppedSkill: string };
  await mutate(context.request, "/api/session/picker");
  await enterParent(page);
  await page.getByRole("button", { name: "Games", exact: true }).click();
  await page.getByRole("link", { name: /^Review games \(\d+\)$/ }).click();
  const list = page.getByRole("navigation", { name: "Games" });

  // The game waits for a person. Its page carries the model reviewer's opinion and its notes, which did not stop it.
  await list.getByLabel("Search games").fill(made.skill);
  await list.getByRole("button", { name: new RegExp(made.title) }).click();
  await expect(page.getByRole("heading", { name: made.title, level: 2 })).toBeVisible();
  await expect(page.getByText("Waiting for you")).toBeVisible();
  await expect(page.getByText("None of these stopped the game", { exact: false })).toBeVisible();
  await expect(page.getByText("The last round plays like a quiz.", { exact: true })).toBeVisible();
  await expect(page.getByText("The second hint gives a lot away.", { exact: true })).toBeVisible();

  // A build that did not make it lists who stopped it, after how many tries, and every reason from the last try.
  const stopped = list.locator(".game-review-job", { hasText: made.stoppedSkill });
  await expect(stopped.getByText("Stopped by the model reviewer after 2 tries:")).toBeVisible();
  await expect(stopped.getByText("Round 2 still says the x-axis runs up and down.", { exact: true })).toBeVisible();
  await expect(stopped.getByText("The last round shows the answer on the sign.", { exact: true })).toBeVisible();
});
