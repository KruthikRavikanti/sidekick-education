/** Synthetic engineering actions derived from public material, never a witness. */
import { expect, type Page } from "@playwright/test";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import type { ProgramSession, ProgramStageEntity } from "../../lib/activity-program-types";
import { csrf, ORIGIN } from "./helpers";

const execute = promisify(execFile);
export type PublicMove = { actionId: string; inputs: { name: string; kind: "integer" | "text"; integer: number | null; text: string | null }[] };

function dataSelector(attribute: string, value: string) {
  return `[${attribute}=${JSON.stringify(value)}]`;
}

async function cancelWorldMove(page: Page) {
  const cancel = page.getByRole("region", { name: "Playable world", exact: true })
    .locator(".world-instruction").getByRole("button", { name: "Cancel move", exact: true });
  if (await cancel.count() && await cancel.isVisible()) await cancel.click();
}

async function chooseWorldEntity(page: Page, current: ProgramSession, entity: ProgramStageEntity) {
  const onMap = page.locator(dataSelector("data-world-entity", entity.id));
  if (await onMap.count() && await onMap.isVisible()) {
    await onMap.click();
    return;
  }
  // A bounded map can show the primary occupants while retaining every public
  // object in the location's native inventory. Never mistake opening that
  // inventory for a pending actor move to the same place.
  await cancelWorldMove(page);
  const location = current.stageView?.locations.find(value => value.id === entity.locationId);
  expect(location, "The public object needs an accessible public location").toBeTruthy();
  await page.locator(dataSelector("data-world-location", location!.id)).click();
  const inventoryObject = page.locator(dataSelector("data-world-inventory-entity", entity.id));
  await expect(inventoryObject).toBeVisible();
  await inventoryObject.click();
}

export async function world(page: Page, id: string): Promise<ProgramSession> {
  const response = await page.request.get(`/api/activity-programs/sessions/${id}`);
  expect(response.ok()).toBeTruthy();
  return response.json();
}

export async function publicPlan(current: ProgramSession): Promise<PublicMove[]> {
  // Optional human-authored engineering responses for an inspected PUBLIC
  // scene. This file is never a production input or an admission witness.
  if (process.env.SIDEKICK_V2_PUBLIC_ACTIONS) {
    const actions = JSON.parse(await readFile(process.env.SIDEKICK_V2_PUBLIC_ACTIONS, "utf8"));
    if (Array.isArray(actions[current.definitionHash])) return actions[current.definitionHash];
  }
  const allowed = ["title", "spaces", "components", "objects", "materials", "state", "stateSlots", "actions", "goals"];
  const projection = Object.fromEntries(allowed.map(key => [key, current[key as keyof ProgramSession]]));
  const folder = await mkdtemp(path.join(os.tmpdir(), "sidekick-v2-public-plan-"));
  try {
    const file = path.join(folder, "public.json");
    await writeFile(file, JSON.stringify(projection), { mode: 0o600 });
    let stdout: string;
    try {
      ({ stdout } = await execute("backend/.venv/bin/python", ["scripts/plan_activity_program_browser.py", "--input", file], {
        env: { ...process.env, SIDEKICK_RUN_V2_LIVE: "true" }, timeout: 400_000, maxBuffer: 128 * 1024,
      }));
    } catch (error) {
      let reason = "driver_request_failed";
      try {
        const output = JSON.parse((error as { stdout?: string }).stdout || "{}");
        if (/^[a-z_]{1,80}$/.test(output.reasonCode)) reason = output.reasonCode;
      } catch {}
      throw new Error(`Synthetic public-world driver failed: ${reason}`);
    }
    const result = JSON.parse(stdout);
    expect(result.error).toBeUndefined();
    expect(result.steps.length).toBeGreaterThan(0);
    return result.steps;
  } finally { await rm(folder, { recursive: true, force: true }); }
}

export async function visibleMove(page: Page, current: ProgramSession, move: PublicMove) {
  const action = current.actions.find(value => value.id === move.actionId);
  expect(action, "Synthetic driver can only use a currently declared public action").toBeTruthy();
  const inputs = Object.fromEntries(move.inputs.map(value => [value.name, value.kind === "integer" ? value.integer : value.text]));
  const surfaces = current.stageView?.surfaces?.filter(item => item.actionId === action!.id && item.cells.some(cell => cell.id === (inputs.cell ?? inputs.piece) && cell.allowed)) || [];
  if (["toggle_tile", "toggle_fraction_piece"].includes(action!.operation)) {
    for (const surface of surfaces) {
      const direct = page.locator(`[data-world-surface=${JSON.stringify(surface.id)}] button[data-surface-cell=${JSON.stringify(inputs.cell ?? inputs.piece)}]`);
      if (await direct.count() && await direct.isVisible() && await direct.isEnabled()) {
        await direct.click({ timeout: 5000 });
        await expect.poll(async () => (await world(page, current.id)).revision, { timeout: 10_000 }).toBeGreaterThan(current.revision);
        return world(page, current.id);
      }
    }
  }
  const tool = page.locator(`[data-program-component=${JSON.stringify(action!.componentId)}]`);
  if (current.stageView && !["move_actor", "place_piece", "inspect_location"].includes(action!.operation) && !await tool.isVisible()) {
    const contextual = current.stageView.tools.find(item => item.componentId === action!.componentId && item.available);
    const entity = current.stageView.entities.find(item => item.id === contextual?.entityId);
    expect(entity, "The declared control must have a visible contextual world object").toBeTruthy();
    await chooseWorldEntity(page, current, entity!);
    if (contextual) {
      const siblings = current.stageView.tools.filter(item => item.entityId === entity!.id);
      const index = siblings.findIndex(item => item.componentId === action!.componentId);
      expect(index, "The selected public object must expose this component's tool").toBeGreaterThanOrEqual(0);
      const choose = page.getByRole("group", { name: "Object tools", exact: true }).getByRole("button").nth(index);
      await expect(choose).toBeEnabled();
      await choose.click();
    }
  }
  switch (action!.operation) {
    case "toggle_tile": {
      const cell = /^r(\d+)c(\d+)$/.exec(String(inputs.cell));
      expect(cell).toBeTruthy();
      await tool.getByRole("button", { name: new RegExp(`^(Place|Lift) tile at row ${Number(cell![1]) + 1}, column ${Number(cell![2]) + 1}$`) }).click();
      break;
    }
    case "resize_rectangle":
      await tool.getByLabel("Rows", { exact: true }).fill(String(inputs.rows));
      await tool.getByLabel("Columns", { exact: true }).fill(String(inputs.columns));
      await tool.getByRole("button", { name: action!.label, exact: true }).click();
      break;
    case "assemble_product":
      await tool.getByLabel("First factor", { exact: true }).fill(String(inputs.left));
      await tool.getByLabel("Second factor", { exact: true }).fill(String(inputs.right));
      await tool.getByLabel("Product", { exact: true }).fill(String(inputs.result));
      await tool.getByRole("button", { name: action!.label, exact: true }).click();
      break;
    case "select_evidence": {
      const sentence = current.materials.flatMap(value => value.items).find(value => value.id === inputs.sentence);
      expect(sentence).toBeTruthy();
      await tool.getByRole("button", { name: sentence!.text, exact: true }).click();
      break;
    }
    case "replace_text":
    case "revise_text":
      await tool.getByRole("textbox").fill(String(inputs.text));
      await tool.getByRole("button", { name: action!.label, exact: true }).click();
      break;
    case "move_actor":
    case "place_piece": {
      const entity = current.stageView?.entities.find(item => item.actionIds.includes(action!.id));
      const location = current.stageView?.locations.find(item => item.id === inputs.destination);
      expect(entity && location).toBeTruthy();
      await chooseWorldEntity(page, current, entity!);
      const arm = page.locator(`[data-world-action=${JSON.stringify(action!.id)}]`);
      if (await arm.count()) await arm.click();
      await page.locator(dataSelector("data-world-location", location!.id)).click();
      break;
    }
    case "inspect_location": {
      const location = current.stageView?.locations.find(item => item.id === inputs.location);
      expect(location).toBeTruthy();
      await cancelWorldMove(page);
      await page.locator(dataSelector("data-world-location", location!.id)).click();
      await page.locator(`[data-world-action=${JSON.stringify(action!.id)}]`).click();
      break;
    }
    case "toggle_fraction_piece": {
      await tool.getByRole("button", { name: "Build pieces", exact: true }).click();
      const index = Number(String(inputs.piece).slice(1)) + 1;
      await tool.getByRole("button", { name: new RegExp(`^(Place|Lift) piece ${index}$`) }).click();
      break;
    }
    case "set_fraction_partition":
      await tool.getByRole("button", { name: `Make ${inputs.denominator} equal parts`, exact: true }).click();
      break;
    case "move_fraction_piece": {
      await tool.getByRole("button", { name: "Move pieces", exact: true }).click();
      await tool.getByRole("button", { name: `Select piece ${Number(String(inputs.from).slice(1)) + 1} to move`, exact: true }).click();
      await tool.getByRole("button", { name: `Place piece ${Number(String(inputs.to).slice(1)) + 1} here`, exact: true }).click();
      break;
    }
    default: throw new Error("Unsupported synthetic browser action");
  }
  await expect.poll(async () => (await world(page, current.id)).revision, { timeout: 10_000 }).toBeGreaterThan(current.revision);
  return world(page, current.id);
}

export async function playPublicWorld(page: Page, initial: ProgramSession, useHelp = false) {
  let current = initial;
  let helped = false;
  for (let attempt = 0; attempt < 4 && current.status !== "completed"; attempt++) {
    const plan = await publicPlan(current);
    for (const move of plan) {
      if (current.status === "completed") break;
      if (useHelp && !helped && current.help.length) {
        const button = page.getByRole("button", { name: /^(Get a hint|Show me an example|Give me a cue)$/ }).first();
        await button.click();
        await expect.poll(async () => (await world(page, current.id)).assistance.received).toBe(true);
        current = await world(page, current.id);
        helped = true;
      }
      current = await visibleMove(page, current, move);
    }
  }
  expect(current.status).toBe("completed");
  await expect(page.getByRole("heading", { name: "Mission complete", exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Mission complete", exact: true })).toBeVisible();
  expect(await world(page, current.id)).toEqual(current);
  const profile = await (await page.request.get("/api/auth/session")).json();
  const replay = await page.request.post(`/api/activity-programs/sessions/${current.id}/replay`, {
    data: { expectedRevision: current.revision },
    headers: { Origin: ORIGIN, "X-CSRF-Token": await csrf(page.request), "X-Sidekick-Profile-Version": String(profile.version) },
  });
  expect(replay.ok()).toBeTruthy();
  expect((await replay.json()).verified).toBe(true);
  return current;
}
