/** Public-projection rendering checks using real account/CSRF authorization.
 * The injected DTO is not a generated program or evidence of admission/review. */
import { expect, test, type Page } from "@playwright/test";
import type { ProgramSession } from "../../lib/activity-program-types";
import { createFamily, csrf, ORIGIN } from "./helpers";

const ROOT = "/api/activity-programs";

async function begin(page: Page, key: string) {
  const account = await (await page.request.get("/api/auth/session")).json();
  const response = await page.request.post(`${ROOT}/preview/${key}/sessions`, {
    data: { requestId: crypto.randomUUID() },
    headers: { Origin: ORIGIN, "X-CSRF-Token": await csrf(page.request), "X-Sidekick-Profile-Version": String(account.version) },
  });
  expect(response.ok(), await response.text()).toBeTruthy();
  return response.json() as Promise<ProgramSession>;
}

test.beforeEach(async ({ context }) => { await createFamily(context, "3"); });

test("a text workspace shows its bound source passage, stock and word pieces before writing", async ({ page }) => {
  const saved = await begin(page, "story_studio");
  const source = "When the rain began, Noor carried the seedlings into the greenhouse. The smallest plants stayed dry.";
  const view: ProgramSession = {
    ...saved,
    objects: saved.objects.map(object => object.kind === "text_artifact" ? { ...object, materialIds: [...object.materialIds, "source-passage", "square-stock", "transition-words"] } : object),
    materials: [...saved.materials,
      { id: "source-passage", kind: "passage", text: source, items: [{ id: "source-first", text: "When the rain began, Noor carried the seedlings into the greenhouse." }, { id: "source-second", text: "The smallest plants stayed dry." }], quantity: null },
      { id: "square-stock", kind: "unit_tiles", text: null, items: [], quantity: 9 },
      { id: "transition-words", kind: "words", text: "Words you may use to connect events.", items: [{ id: "word-before", text: "Before" }, { id: "word-after", text: "Afterward" }], quantity: null },
    ],
  };
  await page.route(`**${ROOT}/sessions/${saved.id}`, route => route.fulfill({ json: view }));
  await page.goto(`/kid/activity-preview/${saved.id}`);
  const editor = page.locator(`[data-program-component="${saved.components[0].id}"]`);
  await expect(editor.locator('[data-program-material="source-passage"]')).toHaveText(source);
  await expect(editor.locator('[data-program-material="source-passage"]')).toBeVisible();
  await expect(editor.getByLabel("Tile stock", { exact: true })).toHaveText("9 unit-square tiles in your stock.");
  const words = editor.getByRole("region", { name: "Word pieces", exact: true });
  await expect(words.getByRole("listitem")).toHaveText(["Before", "Afterward"]);
  await expect(editor.getByRole("textbox")).toHaveValue("");
  const authoritative = await (await page.request.get(`${ROOT}/sessions/${saved.id}`)).json() as ProgramSession;
  expect(authoritative.actionCount).toBe(0);
  expect(authoritative.revision).toBe(0);
});

test("an evidence board renders each attached passage once beside its literal options", async ({ page }) => {
  const saved = await begin(page, "trail_evidence");
  await page.goto(`/kid/activity-preview/${saved.id}`);
  for (const component of saved.components) {
    const view = page.locator(`[data-program-component="${component.id}"]`);
    const materialIds = new Set(saved.objects.filter(object => component.objectIds.includes(object.id)).flatMap(object => object.materialIds));
    for (const passage of saved.materials.filter(material => material.kind === "passage" && materialIds.has(material.id))) {
      const rendered = view.locator(`[data-program-material="${passage.id}"]`);
      await expect(rendered).toHaveCount(1);
      await expect(rendered).toHaveText(passage.text!);
      for (const item of passage.items) await expect(view.getByRole("button", { name: item.text, exact: true })).toBeVisible();
    }
  }
});
