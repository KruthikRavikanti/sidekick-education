import { test, expect, type Page } from "@playwright/test";
import { execFile } from "node:child_process";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { createFamily } from "./helpers";

const root = process.cwd();
const screenshots = "/tmp/sidekick-screens";
const execute = promisify(execFile);
let browserErrors: string[];

async function heicPhoto() {
  // Encode a synthetic worksheet, never a real child's photo. Chromium cannot
  // decode HEIC itself, so the preview must use the actual backend decoder.
  const { stdout } = await execute(
    path.join(root, "backend/.venv/bin/python"),
    [
      "-c",
      "import io,sys; from PIL import Image; from pillow_heif import register_heif_opener; register_heif_opener(); image=Image.open(sys.argv[1]).convert('RGB'); image.thumbnail((640,640)); output=io.BytesIO(); image.save(output,format='HEIF',quality=70); sys.stdout.buffer.write(output.getvalue())",
      path.join(root, "public/samples/math-worksheet.png"),
    ],
    { encoding: "buffer", maxBuffer: 2 * 1024 * 1024 },
  );
  return stdout;
}

test.beforeEach(async ({ page, context }) => {
  browserErrors = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));
  await createFamily(context);
  await page.goto("/kid/homework");
  await expect(page.getByText("Sample mode", { exact: true })).toBeVisible();
});

test.afterEach(() => {
  expect(browserErrors, "No uncaught browser errors").toEqual([]);
});

async function assertNoHorizontalOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
}

async function downloadExtraction(page: Page) {
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download JSON" }).click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe("sidekick-worksheet.json");
  const saved = await download.path();
  expect(saved).not.toBeNull();
  return JSON.parse(await readFile(saved!, "utf8"));
}

test("fractions flow preserves mistakes, step order, blanks, uncertainty, and JSON", async ({
  page,
}) => {
  await mkdir(screenshots, { recursive: true });
  await assertNoHorizontalOverflow(page);
  await page.screenshot({
    path: `${screenshots}/mobile-upload.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Fractions", exact: true }).click();
  await expect(
    page.getByRole("img", { name: "Preview of your selected work" }),
  ).toBeVisible();
  await page.screenshot({
    path: `${screenshots}/mobile-preview.png`,
    fullPage: true,
  });
  // Returning from the native camera/file picker must preserve the chosen photo.
  const sessionCheck = page.waitForResponse((response) =>
    response.url().endsWith("/api/auth/session"),
  );
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await sessionCheck;
  await expect(
    page.getByRole("img", { name: "Preview of your selected work" }),
  ).toBeVisible();

  // Observe the real multipart request; delay only its departure to exercise reading UI.
  await page.route("**/api/extract", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    await route.continue();
  });
  const pendingRequest = page.waitForRequest((request) =>
    request.url().endsWith("/api/extract"),
  );
  await page
    .getByRole("button", { name: "Read my work", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Reading your work…" }),
  ).toBeVisible();
  const request = await pendingRequest;
  expect(request.method()).toBe("POST");
  expect(request.headers()["content-type"]).toContain(
    "multipart/form-data; boundary=",
  );
  await expect(
    page.getByRole("heading", { name: "Here’s your work." }),
  ).toBeVisible();
  await expect(
    page.getByText("Math · detected", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Grade 4", { exact: true })).toBeVisible();
  await expect(
    page.getByText(
      "Solve each problem. Show your work. Use the table for 4(a).",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByText("Ingredient | Amount", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Sample results · This is a pre-written extraction of the sample page.",
      { exact: true },
    ),
  ).toBeVisible();

  const cards = page.getByRole("article");
  await expect(cards).toHaveCount(4);
  expect(
    await cards.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("aria-label")),
    ),
  ).toEqual(["Problem 1", "Problem 2", "Problem 3", "Problem 4(a)"]);
  await expect(
    cards
      .nth(0)
      .getByRole("list", { name: "Written steps in order" })
      .getByRole("listitem"),
  ).toHaveText(["1 + 1 = 2", "2 + 3 = 5", "1/2 + 1/3 = 2/5"]);
  await expect(cards.nth(0).getByText("2/5", { exact: true })).toBeVisible();
  await expect(
    cards.nth(1).getByText("Blank response", { exact: true }),
  ).toBeVisible();
  await expect(
    cards.nth(1).getByText("No written response visible.", { exact: true }),
  ).toBeVisible();
  await expect(
    cards.nth(2).getByText("Unclear response", { exact: true }),
  ).toBeVisible();
  await expect(cards.nth(2).getByRole("listitem")).toContainText("3/");
  await expect(
    cards.nth(2).getByText("Unreadable text", { exact: true }),
  ).toBeVisible();
  await expect(
    cards.nth(2).getByText("Partly unreadable", { exact: true }),
  ).toHaveCount(2);
  await expect(
    cards.nth(3).getByRole("link", { name: "See Recipe table" }),
  ).toHaveAttribute("href", "#context-recipe-table");
  await expect(
    cards.nth(3).getByText("Selected choice", { exact: true }),
  ).toBeVisible();
  await assertNoHorizontalOverflow(page);
  await page.screenshot({
    path: `${screenshots}/mobile-math-results.png`,
    fullPage: true,
  });

  const downloaded = await downloadExtraction(page);
  const expected = JSON.parse(
    await readFile(path.join(root, "fixtures/math.json"), "utf8"),
  );
  expect(downloaded).toEqual({ ...expected, source: "fixture" });
  expect(downloaded.problems[1].student_work.final_answer).toEqual({
    text: null,
    uncertain: false,
  });
  expect(downloaded.problems[2].student_work.final_answer).toEqual({
    text: null,
    uncertain: true,
  });
  await page.getByRole("button", { name: "Read more work" }).click();
  await expect(
    page.getByRole("heading", { name: "Big page. Little first step." }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: "Preview of your selected work" }),
  ).toHaveCount(0);
});

test("camera input reads ELA with passage, partial question, and selected answer", async ({
  page,
}) => {
  const camera = page.getByLabel("Take work photo", { exact: true });
  await expect(camera).toHaveAttribute("capture", "environment");
  await camera.setInputFiles(
    path.join(root, "public/samples/ela-worksheet.png"),
  );
  await expect(
    page.getByRole("img", { name: "Preview of your selected work" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Read my work", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Here’s your work." }),
  ).toBeVisible();
  await expect(page.getByText("ELA · detected", { exact: true })).toBeVisible();
  await expect(page.getByText("Grade 3", { exact: true })).toBeVisible();
  await expect(
    page.getByText("It was the first warm morning of spring.", {
      exact: false,
    }),
  ).toBeVisible();
  const cards = page.getByRole("article");
  await expect(
    cards.nth(0).getByText("The story happens in winter.", { exact: true }),
  ).toBeVisible();
  await expect(
    cards.nth(1).getByText("Blank response", { exact: true }),
  ).toBeVisible();
  await expect(
    cards.nth(2).getByText("Unclear response", { exact: true }),
  ).toBeVisible();
  await expect(
    cards.nth(2).getByText("Why does … at the end?", { exact: false }),
  ).toBeVisible();
  await expect(cards.nth(2).getByRole("listitem")).toContainText("because she");
  await expect(
    cards.nth(2).getByText("Partly unreadable", { exact: true }),
  ).toHaveCount(3);
  await expect(
    cards
      .nth(3)
      .getByRole("list", { name: "Answer choices" })
      .getByRole("listitem"),
  ).toHaveCount(3);
  await expect(
    cards.nth(3).getByRole("link", { name: "See A seed for tomorrow" }),
  ).toHaveAttribute("href", "#context-seed-passage");
  const downloaded = await downloadExtraction(page);
  expect(downloaded).toEqual({
    ...JSON.parse(await readFile(path.join(root, "fixtures/ela.json"), "utf8")),
    source: "fixture",
  });
  expect(downloaded.problems[3].student_work.selected_choice.text).toBe("B");
  await assertNoHorizontalOverflow(page);
  await mkdir(screenshots, { recursive: true });
  await page.screenshot({
    path: `${screenshots}/mobile-ela-results.png`,
    fullPage: true,
  });
});

test("native image chooser preserves the selected photo after a focus session check", async ({
  page,
}) => {
  // The wildcard lets macOS Photos supply its image format, including HEIC.
  // Native macOS Photos dialog behavior is outside this browser test.
  await expect(page.getByLabel("Choose work image", { exact: true })).toHaveAttribute(
    "accept",
    "image/*,application/pdf,.pdf",
  );
  await expect(page.getByLabel("Take work photo", { exact: true })).toHaveAttribute(
    "accept",
    "image/*",
  );
  const choosing = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Choose an image", exact: true }).click();
  const chooser = await choosing;
  await chooser.setFiles(path.join(root, "public/samples/math-worksheet.png"));

  const preview = page.getByRole("img", { name: "Preview of your selected work" });
  await expect(preview).toBeVisible();
  const selectedPhoto = await preview.getAttribute("src");
  expect(selectedPhoto).toMatch(/^blob:/);

  const checkedSession = page.waitForResponse((response) =>
    response.url().endsWith("/api/auth/session"),
  );
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  expect((await checkedSession).ok()).toBe(true);
  await expect(preview).toBeVisible();
  await expect(preview).toHaveAttribute("src", selectedPhoto!);
  await expect(page.getByText("math-worksheet.png", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Read my work", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Here’s your work." }),
  ).toBeVisible();
  await expect(page.getByText("Math · detected", { exact: true })).toBeVisible();
});

for (const mimeType of ["image/heic", "application/octet-stream"]) {
  test(`Photos HEIC previews through the backend and sends original bytes (${mimeType})`, async ({
    page,
  }) => {
    const original = await heicPhoto();
    const fixture = JSON.parse(await readFile(path.join(root, "fixtures/math.json"), "utf8"));
    // Fixture mode intentionally recognizes exact sample bytes only. Keep the
    // real HEIC preview request and stub only the later model extraction.
    await page.route("**/api/extract", (route) => route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ...fixture, source: "fixture" }),
    }));
    const previewResponse = page.waitForResponse((response) =>
      response.url().endsWith("/api/images/preview"),
    );
    await page.getByLabel("Choose work image", { exact: true }).setInputFiles({
      name: "worksheet.HEIC",
      mimeType,
      buffer: original,
    });
    const decoded = await previewResponse;
    expect(decoded.status()).toBe(200);
    expect(decoded.headers()["content-type"]).toContain("image/png");
    expect(decoded.headers()["cache-control"]).toContain("no-store");
    const preview = page.getByRole("img", { name: "Preview of your selected work" });
    await expect(preview).toBeVisible();
    await expect.poll(() => preview.evaluate(
      (image) => (image as HTMLImageElement).naturalWidth,
    )).toBeGreaterThan(0);
    const read = page.getByRole("button", { name: "Read my work", exact: true });
    await expect(read).toBeEnabled();
    const sent = page.waitForRequest((request) => request.url().endsWith("/api/extract"));
    await read.click();
    const request = await sent;
    const multipart = request.postDataBuffer();
    expect(multipart).not.toBeNull();
    expect(multipart!.includes(original)).toBe(true);
    expect(multipart!.toString("latin1")).toContain('filename="worksheet.HEIC"');
    expect(multipart!.toString("latin1")).toContain("Content-Type: image/heic");
    await expect(page.getByRole("heading", { name: "Here’s your work." })).toBeVisible();
  });
}

test("an unreadable HEIC photo shows an error and allows choosing a different image", async ({
  page,
}) => {
  const decoded = page.waitForResponse((response) => response.url().endsWith("/api/images/preview"));
  const input = page.getByLabel("Choose work image", { exact: true });
  await input.setInputFiles({
    name: "damaged.heic",
    mimeType: "image/heic",
    buffer: Buffer.from("invalid HEIC image"),
  });
  const response = await decoded;
  expect(response.status()).toBe(400);
  expect((await response.json()).error.code).toBe("invalid_image");
  await expect(page.getByRole("region", { name: "Upload work" }).getByRole("alert"))
    .toContainText(/couldn’t|couldn't|Choose|could not/);
  await expect(page.getByText("Preparing your photo…", { exact: true })).toHaveCount(0);
  await input.setInputFiles(path.join(root, "public/samples/math-worksheet.png"));
  await expect(page.getByRole("img", { name: "Preview of your selected work" })).toBeVisible();
  await page.getByRole("button", { name: "Read my work", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Here’s your work." })).toBeVisible();
});

test("a delayed HEIC preview cannot replace a newer image selection", async ({
  page,
}) => {
  let release!: () => void;
  let markReady!: () => void;
  let markFinished!: () => void;
  const ready = new Promise<void>((resolve) => { markReady = resolve; });
  const finished = new Promise<void>((resolve) => { markFinished = resolve; });
  await page.route("**/api/images/preview", async (route) => {
    const response = await route.fetch();
    expect(response.status()).toBe(200);
    const released = new Promise<void>((resolve) => { release = resolve; });
    markReady();
    await released;
    // Replacement aborts the old request, whose delayed body must stay ignored.
    await route.fulfill({ response }).catch(() => {});
    markFinished();
  });
  await page.getByLabel("Choose work image", { exact: true }).setInputFiles({
    name: "older.heic",
    mimeType: "image/heic",
    buffer: await heicPhoto(),
  });
  await ready;
  await expect(page.getByText("Preparing your photo…", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Read my work", exact: true })).toBeDisabled();
  const choosing = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Change image", exact: true }).click();
  await (await choosing).setFiles(path.join(root, "public/samples/math-worksheet.png"));
  const preview = page.getByRole("img", { name: "Preview of your selected work" });
  await expect(preview).toBeVisible();
  const newerPreview = await preview.getAttribute("src");
  release();
  await finished;
  await expect(preview).toHaveAttribute("src", newerPreview!);
  await expect(page.getByText("math-worksheet.png", { exact: false })).toBeVisible();
  await expect(page.getByText("older.heic", { exact: false })).toHaveCount(0);
  await page.getByRole("button", { name: "Read my work", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Here’s your work." })).toBeVisible();
});

test("CSRF rejection keeps the photo and retries with a fresh token against the backend", async ({
  page,
}) => {
  let attempts = 0;
  await page.route("**/api/extract", async (route) => {
    attempts += 1;
    if (attempts === 1) {
      await route.fulfill({
        status: 403,
        contentType: "application/json",
        body: JSON.stringify({
          error: {
            code: "csrf_failed",
            message: "This request could not be verified. Refresh the page and try again.",
          },
        }),
      });
      return;
    }
    await route.continue();
  });
  await page.getByLabel("Choose work image", { exact: true }).setInputFiles(
    path.join(root, "public/samples/math-worksheet.png"),
  );
  await page.getByRole("button", { name: "Read my work", exact: true }).click();

  await expect(
    page.getByRole("region", { name: "Upload work" }).getByRole("alert"),
  ).toContainText(/could not be verified|couldn’t verify|Refresh/);
  await expect(
    page.getByRole("img", { name: "Preview of your selected work" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Reading your work…" }),
  ).toHaveCount(0);
  const retry = page.getByRole("button", { name: "Read my work", exact: true });
  await expect(retry).toBeEnabled();

  const freshToken = page.waitForRequest((request) =>
    request.url().endsWith("/api/auth/csrf"),
  );
  const extracted = page.waitForResponse((response) =>
    response.url().endsWith("/api/extract") && response.status() === 200,
  );
  await retry.click();
  await freshToken;
  expect((await (await extracted).json()).source).toBe("fixture");
  await expect(
    page.getByRole("heading", { name: "Here’s your work." }),
  ).toBeVisible();
  expect(attempts).toBe(2);
});

test("invalid, oversized, and empty files are rejected before upload", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith("/api/extract")) requests.push(request.method());
  });
  const input = page.getByLabel("Choose work image", { exact: true });
  const alert = page
    .getByRole("region", { name: "Upload work" })
    .getByRole("alert");
  await input.setInputFiles({
    name: "worksheet.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("not an image"),
  });
  await expect(alert).toContainText("Choose a JPG, PNG, WebP, HEIC, or HEIF image, or a PDF.");
  await expect(
    page.getByRole("button", { name: "Read my work", exact: true }),
  ).toHaveCount(0);
  await input.setInputFiles({
    name: "large.png",
    mimeType: "image/png",
    buffer: Buffer.alloc(10 * 1024 * 1024 + 1),
  });
  await expect(alert).toContainText("That file is too large.");
  await input.setInputFiles({
    name: "empty.png",
    mimeType: "image/png",
    buffer: Buffer.alloc(0),
  });
  await expect(alert).toContainText("That file is empty.");
  expect(requests).toEqual([]);
});

test("provider failure keeps the photo and retry reaches the real backend", async ({
  page,
}) => {
  let attempts = 0;
  await page.route("**/api/extract", async (route) => {
    attempts += 1;
    if (attempts === 1) {
      await route.fulfill({
        status: 502,
        contentType: "application/json",
        body: JSON.stringify({
          error: {
            code: "provider_unavailable",
            message:
              "The work reader is unavailable. Please retry in a moment.",
          },
        }),
      });
    } else {
      const response = await route.fetch();
      const data = await response.json();
      // A title can be unreadable while its passage and linked problems remain useful.
      data.worksheet.shared_context[0].title = { text: null, uncertain: true };
      await route.fulfill({ response, json: data });
    }
  });
  await page.getByRole("button", { name: "Reading", exact: true }).click();
  await page
    .getByRole("button", { name: "Read my work", exact: true })
    .click();
  await expect(
    page.getByRole("region", { name: "Upload work" }).getByRole("alert"),
  ).toContainText(
    "The work reader is unavailable. Please retry in a moment.",
  );
  await expect(
    page.getByRole("img", { name: "Preview of your selected work" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Retake photo" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Read my work", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Here’s your work." }),
  ).toBeVisible();
  expect(attempts).toBe(2);
  await expect(
    page
      .getByRole("article")
      .nth(0)
      .getByText("The story happens in winter.", { exact: true }),
  ).toBeVisible();
  const contextSummary = page.locator("#context-seed-passage summary");
  await expect(
    contextSummary.getByText("Shared passage", { exact: true }),
  ).toBeVisible();
  await expect(
    contextSummary.getByText("Partly unreadable", { exact: true }),
  ).toBeVisible();
});

test("cancelled extraction cannot replace a later upload", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await assertNoHorizontalOverflow(page);
  await mkdir(screenshots, { recursive: true });
  await page.screenshot({
    path: `${screenshots}/desktop-upload.png`,
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });

  let releaseOldResponse!: () => void;
  let oldResponseReady!: () => void;
  let oldResponseFinished!: () => void;
  const pendingOldResponse = new Promise<void>((resolve) => {
    oldResponseReady = resolve;
  });
  const pendingOldFinished = new Promise<void>((resolve) => {
    oldResponseFinished = resolve;
  });
  let requests = 0;
  await page.route("**/api/extract", async (route) => {
    requests += 1;
    if (requests !== 1) return route.continue();
    const response = await route.fetch();
    const released = new Promise<void>((resolve) => {
      releaseOldResponse = resolve;
    });
    oldResponseReady();
    await released;
    // The browser has aborted this request; releasing it must not restore old results.
    await route.fulfill({ response }).catch(() => {});
    oldResponseFinished();
  });

  await page.getByRole("button", { name: "Fractions", exact: true }).click();
  await page
    .getByRole("button", { name: "Read my work", exact: true })
    .click();
  await pendingOldResponse;
  await expect(
    page.getByRole("heading", { name: "Reading your work…" }),
  ).toBeVisible();
  await page.screenshot({
    path: `${screenshots}/mobile-reading.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(
    page.getByRole("img", { name: "Preview of your selected work" }),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Upload work" }).getByRole("alert"),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Start over", exact: true }).click();
  await page.getByRole("button", { name: "Reading", exact: true }).click();
  await page
    .getByRole("button", { name: "Read my work", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Here’s your work." }),
  ).toBeVisible();
  await expect(page.getByText("ELA · detected", { exact: true })).toBeVisible();
  releaseOldResponse();
  await pendingOldFinished;
  await expect(page.getByText("ELA · detected", { exact: true })).toBeVisible();
  await expect(page.getByText("Math · detected", { exact: true })).toHaveCount(
    0,
  );
  expect(requests).toBe(2);
});
