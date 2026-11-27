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
