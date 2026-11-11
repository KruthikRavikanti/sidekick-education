import { test, expect, type Page } from "@playwright/test";
import { createFamily, mutate, PASSWORD, PIN, ORIGIN, csrf } from "./helpers";

async function enterParent(page: Page, pin = PIN) {
  await page.getByRole("button", { name: /Parent.*PIN protected/ }).click();
  await page.getByLabel("Parent PIN", { exact: true }).fill(pin);
  await page
    .getByRole("button", { name: "Enter parent mode", exact: true })
    .click();
  await expect(page).toHaveURL(/\/parent\/dashboard$/);
  await expect(page.getByText("Parent mode", { exact: true })).toBeVisible();
}

async function addChild(
  page: Page,
  name: string,
  grade: string,
  avatar: string,
) {
  await page.getByRole("button", { name: "Children", exact: true }).click();
  await page.getByRole("button", { name: "Add child", exact: true }).click();
  await page.getByLabel("First name or nickname").fill(name);
  await page.getByLabel("Grade", { exact: true }).selectOption(grade);
  await page.getByRole("radio", { name: avatar, exact: true }).click();
  await page.getByRole("button", { name: "Add child", exact: true }).click();
  await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
}

test("parent signs up, sets a PIN, adds two children, and explores real learning dashboard", async ({
  page,
}) => {
  const email = `journey-${Date.now()}@example.com`;
  await page.goto("/signup");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Who’s learning today?" }),
  ).toBeVisible();
  await expect(
    page.getByText("add your first child", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Parent.*PIN protected/ }).click();
  await page.getByLabel("Account password", { exact: true }).fill("incorrect");
  await page.getByLabel("New PIN", { exact: true }).fill(PIN);
  await page.getByLabel("Confirm PIN", { exact: true }).fill(PIN);
  await page
    .getByRole("button", { name: "Save parent PIN", exact: true })
    .click();
  await expect(page.locator("form").getByRole("alert")).toContainText(
    "account password is incorrect",
  );
  await page.getByLabel("Account password", { exact: true }).fill(PASSWORD);
  await page
    .getByRole("button", { name: "Save parent PIN", exact: true })
    .click();
  await expect(page.getByLabel("Parent PIN", { exact: true })).toBeVisible();
  await page.getByLabel("Parent PIN", { exact: true }).fill(PIN);
  await page
    .getByRole("button", { name: "Enter parent mode", exact: true })
    .click();
  await expect(page.getByText("Parent mode", { exact: true })).toBeVisible();
  await addChild(page, "Alex", "3", "Fox");
  await addChild(page, "Maya", "1", "Owl");
  await page.getByRole("button", { name: "Skills", exact: true }).click();
  await page
    .getByRole("combobox", { name: "Choose child", exact: true })
    .selectOption({ label: "Alex" });
  await expect(
    page.getByText("Learning activity", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".skill-card").first()).toBeVisible();
  await expect(
    page.locator(".skill-card:not(.skill-card-unassessed)"),
  ).toHaveCount(0);
  await expect(
    page
      .getByLabel("Skill status legend")
      .getByText("Not enough evidence", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Analytics", exact: true }).click();
  for (const label of ["Questions read", "Correct answers", "Not graded yet"])
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  await expect(page.locator(".metric-card strong")).toHaveText(["0", "0", "0"]);
  await page
    .getByRole("button", { name: "Conversations", exact: true })
    .click();
  await expect(
    page.getByText("No learning conversations yet.", {
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Switch profile", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Who’s learning today?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Alex.*Let’s learn/ }).click();
  await expect(page).toHaveURL(/\/kid$/);
  await expect(
    page.getByRole("link", { name: /Upload work/ }),
  ).toBeVisible();
  await expect(page.getByText("Parent mode", { exact: true })).toHaveCount(0);
  expect((await page.request.get("/api/parent/settings")).status()).toBe(403);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});

test("kid parent URLs go to PIN gate before loading parent data; siblings and foreign IDs are refused", async ({
  page,
  context,
  browser,
}) => {
  const family = await createFamily(context);
  expect(
    (
      await mutate(context.request, "/api/parent/pin/verify", { pin: PIN })
    ).ok(),
  ).toBeTruthy();
  const response = await mutate(context.request, "/api/parent/profiles", {
    firstName: "Maya",
    grade: "1",
    avatarKey: "owl",
  });
  const sibling = await response.json();
  await mutate(context.request, "/api/session/kid", {
    profileId: family.kid.id,
  });
  const parentDataRequests: string[] = [];
  page.on("request", (request) => {
    if (
      /\/api\/parent\/(dashboard|settings|profiles|conversations)/.test(
        request.url(),
      )
    )
      parentDataRequests.push(request.url());
  });
  await page.goto("/parent/dashboard");
  await expect(page).toHaveURL(/\/parent\/unlock$/);
  await expect(page.getByLabel("Parent PIN", { exact: true })).toBeVisible();
  expect(parentDataRequests).toEqual([]);
  expect(
    (await context.request.get(`/api/kid/profile/${sibling.id}`)).status(),
  ).toBe(403);
  const foreign = await browser.newContext({ baseURL: ORIGIN });
  try {
    await createFamily(foreign);
    expect(
      (
        await mutate(foreign.request, "/api/session/kid", {
          profileId: family.kid.id,
        })
      ).status(),
    ).toBe(404);
    await mutate(foreign.request, "/api/parent/pin/verify", { pin: PIN });
    expect(
      (
        await foreign.request.get(`/api/parent/dashboard/${family.kid.id}`)
      ).status(),
    ).toBe(404);
  } finally {
    await foreign.close();
  }
});

test("refresh, back navigation, and shared tabs clear parent access", async ({
  page,
  context,
}) => {
  await createFamily(context);
  await mutate(context.request, "/api/session/picker");
  await page.goto("/profiles");
  await enterParent(page);
  await page.reload();
  await expect(page).toHaveURL(/\/parent\/unlock$/);
  expect((await context.request.get("/api/parent/profiles")).status()).toBe(
    403,
  );
  await page.getByLabel("Parent PIN", { exact: true }).fill(PIN);
  await page
    .getByRole("button", { name: "Enter parent mode", exact: true })
    .click();
  await expect(page.getByText("Parent mode", { exact: true })).toBeVisible();
  const second = await context.newPage();
  await second.goto("/profiles");
  await expect(page.getByText("Parent mode", { exact: true })).toHaveCount(0);
  expect((await context.request.get("/api/parent/profiles")).status()).toBe(
    403,
  );
  await second.goto("/profiles");
  await expect(
    second.getByRole("heading", { name: "Who’s learning today?" }),
  ).toBeVisible();
  await second.getByRole("button", { name: /Alex.*Let’s learn/ }).click();
  await expect(second).toHaveURL(/\/kid$/);
  await page.goBack();
  await expect(page.getByText("Parent mode", { exact: true })).toHaveCount(0);
  expect((await context.request.get("/api/parent/settings")).status()).toBe(
    403,
  );
  await second.close();
});

test("PIN lockout can be recovered through account-password reset; password change rotates login", async ({
  page,
  context,
}) => {
  const family = await createFamily(context);
  await page.goto("/parent/unlock");
  for (let attempt = 0; attempt < 5; attempt++) {
    await page.getByLabel("Parent PIN", { exact: true }).fill("9999");
    const verification = page.waitForResponse(
      (response) =>
        response.url().endsWith("/api/parent/pin/verify") &&
        response.request().method() === "POST",
    );
    await page
      .getByRole("button", { name: "Enter parent mode", exact: true })
      .click();
    expect((await verification).status()).toBe(attempt === 4 ? 429 : 401);
    await expect(page.locator("form").getByRole("alert")).toContainText(
      attempt === 4 ? "five minutes" : "PIN is incorrect",
    );
  }
  await page.getByRole("button", { name: "Forgot PIN?", exact: true }).click();
  await page.getByLabel("Account password", { exact: true }).fill(PASSWORD);
  await page.getByLabel("New PIN", { exact: true }).fill("0007");
  await page.getByLabel("Confirm PIN", { exact: true }).fill("0007");
  await page.getByRole("button", { name: "Reset PIN", exact: true }).click();
  await page.getByLabel("Parent PIN", { exact: true }).fill("0007");
  await page
    .getByRole("button", { name: "Enter parent mode", exact: true })
    .click();
  await expect(page.getByText("Parent mode", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await page.getByLabel("Current password", { exact: true }).fill(PASSWORD);
  await page
    .getByLabel("New password", { exact: true })
    .fill("new local password");
  await page
    .getByRole("button", { name: "Change password", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Who’s learning today?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Log out", exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel("Email", { exact: true }).fill(family.email);
  await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page.locator("form").getByRole("alert")).toHaveText(
    "Email or password is incorrect.",
  );
  await page.getByLabel("Password", { exact: true }).fill("new local password");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Who’s learning today?" }),
  ).toBeVisible();
});

test("CSRF is required for authentication and multipart extraction", async ({
  context,
}) => {
  const headers = { Origin: ORIGIN };
  expect(
    (
      await context.request.post("/api/auth/login", {
        headers,
        data: { email: "no@example.com", password: PASSWORD },
      })
    ).status(),
  ).toBe(403);
  await createFamily(context);
  const token = await csrf(context.request);
  expect(
    (
      await context.request.post("/api/session/picker", {
        headers: { "X-CSRF-Token": token, Origin: "https://attacker.example" },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await context.request.post("/api/extract", {
        headers,
        multipart: {
          file: {
            name: "fake.png",
            mimeType: "image/png",
            buffer: Buffer.from("fake"),
          },
        },
      })
    ).status(),
  ).toBe(403);
});

test("profile management enforces six children, edits names, and confirms deletion", async ({
  page,
  context,
}) => {
  const family = await createFamily(context);
  await mutate(context.request, "/api/parent/pin/verify", { pin: PIN });
  for (let i = 0; i < 5; i++) {
    const response = await mutate(context.request, "/api/parent/profiles", {
      firstName: `Learner ${i + 1}`,
      grade: "2",
      avatarKey: "bear",
    });
    expect(response.status()).toBe(201);
  }
  expect(
    (
      await mutate(context.request, "/api/parent/profiles", {
        firstName: "Seventh",
        grade: "2",
        avatarKey: "bear",
      })
    ).status(),
  ).toBe(409);
  await mutate(context.request, "/api/session/picker");
  await page.goto("/profiles");
  await enterParent(page);
  await page.getByRole("button", { name: "Children", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Add child", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Edit Alex", exact: true }).click();
  await page.getByLabel("First name or nickname").fill("Al");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Al", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Delete Al", exact: true }).click();
  await expect(page.getByRole("alertdialog")).toContainText(
    "Delete Al’s profile?",
  );
  await page
    .getByRole("button", { name: "Confirm delete", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Al", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Add child", exact: true }),
  ).toBeEnabled();
  const profiles = (await context.request.get("/api/parent/profiles")).json();
  expect(
    (await profiles).profiles.some(
      (p: { id: string }) => p.id === family.kid.id,
    ),
  ).toBeFalsy();
});

test("switching children in another tab clears the old photo and delayed results", async ({
  page,
  context,
}) => {
  const family = await createFamily(context);
  await mutate(context.request, "/api/parent/pin/verify", { pin: PIN });
  await mutate(context.request, "/api/parent/profiles", {
    firstName: "Maya",
    grade: "1",
    avatarKey: "owl",
  });
  await mutate(context.request, "/api/session/kid", {
    profileId: family.kid.id,
  });
  await page.goto("/kid/homework");
  const other = await context.newPage();
  await other.goto("/kid");
  await expect(
    other.getByRole("heading", { name: "Hey, Alex!", exact: true }),
  ).toBeVisible();
  let ready!: () => void;
  let release!: () => void;
  let finished!: () => void;
  const responseReady = new Promise<void>((resolve) => {
    ready = resolve;
  });
  const responseFinished = new Promise<void>((resolve) => {
    finished = resolve;
  });
  await page.route("**/api/extract", async (route) => {
    const response = await route.fetch();
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    ready();
    await held;
    await route.fulfill({ response }).catch(() => {});
    finished();
  });
  await page.getByRole("button", { name: "Fractions", exact: true }).click();
  await page
    .getByRole("button", { name: "Read my work", exact: true })
    .click();
  await responseReady;
  await expect(
    page.getByRole("heading", { name: "Reading your work…" }),
  ).toBeVisible();
  await other
    .getByRole("button", { name: "Switch profile", exact: true })
    .click();
  await expect(
    other.getByRole("heading", { name: "Who’s learning today?" }),
  ).toBeVisible();
  await other.getByRole("button", { name: /Maya.*Let’s learn/ }).click();
  await expect(
    other.getByRole("heading", { name: "Hey, Maya!", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Hey, Maya!", exact: true }),
  ).toBeVisible();
  release();
  await responseFinished;
  await expect(
    page.getByRole("heading", { name: "Here’s your work." }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("img", { name: "Preview of your selected work" }),
  ).toHaveCount(0);
  await other.close();
});
