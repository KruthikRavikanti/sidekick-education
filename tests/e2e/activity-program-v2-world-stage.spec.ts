/** Controlled public-DTO rendering checks. Real account/CSRF entry is retained;
 * action responses are explicit UI stubs, not admission, learning or replay proof. */
import { expect, test, type Page } from "@playwright/test";
import type { ProgramSession } from "../../lib/activity-program-types";
import { createFamily, csrf, ORIGIN } from "./helpers";
import branchingConstruction from "./fixtures/controlled-branching-construction.json";

const BASE = "/api/activity-programs";

async function begin(page: Page, key: string) {
  const account = await (await page.request.get("/api/auth/session")).json();
  const response = await page.request.post(`${BASE}/preview/${key}/sessions`, {
    data: { requestId: crypto.randomUUID() },
    headers: { Origin: ORIGIN, "X-CSRF-Token": await csrf(page.request), "X-Sidekick-Profile-Version": String(account.version) },
  });
  expect(response.ok(), await response.text()).toBeTruthy();
  return response.json() as Promise<ProgramSession>;
}

function stage(base: ProgramSession, representationObjectId: string): ProgramSession {
  return {
    ...base,
    title: "A controlled world for rendering checks",
    status: "in_progress",
    goals: [{ id: "delivery", description: "Change the construction, then carry the parcel across.", achieved: false }],
    actions: [...base.actions, {
      id: "carry", componentId: "world-controls", operation: "move_actor", objectIds: ["courier-piece"],
      inputs: [{ id: "destination", kind: "choice", options: ["start", "finish"] }], label: "Carry the parcel",
    }],
    components: [...base.components, { id: "world-controls", kind: "world_stage", objectIds: ["courier-piece"], spaceId: base.spaces[0].id }],
    stageView: {
      locations: [
        { id: "start", label: "Starting shore", x: 8, y: 60, capacity: 4, accepts: "any", inspected: false, actionIds: [] },
        { id: "workbench", label: "Workshop", x: 50, y: 12, capacity: 2, accepts: "device", inspected: false, actionIds: [] },
        { id: "finish", label: "Other shore", x: 92, y: 60, capacity: 4, accepts: "any", inspected: false, actionIds: [] },
      ],
      entities: [
        { id: "courier", label: "Parcel cart", kind: "actor", asset: "cart", objectId: "courier-piece", representationObjectId: null, locationId: "start", currentStatus: "idle", reactionText: null, actionIds: ["carry"], toolComponentIds: [] },
        { id: "construction", label: "Construction table", kind: "device", asset: "bridge", objectId: "bench-piece", representationObjectId, locationId: "workbench", currentStatus: "blocked", reactionText: "The construction can change the crossing.", actionIds: [], toolComponentIds: [base.components[0].id] },
        { id: "delivery", label: "Parcel stop", kind: "destination", asset: "flag", objectId: null, representationObjectId: null, locationId: "finish", currentStatus: "idle", reactionText: null, actionIds: [], toolComponentIds: [] },
      ],
      connections: [{ id: "crossing", fromLocation: "start", toLocation: "finish", bidirectional: true, open: false, label: "Crossing ready", blockedLabel: "Crossing needs construction" }],
      tools: [{ componentId: base.components[0].id, entityId: "construction", label: "Build the crossing", available: true }],
      reactions: [],
      actionTargets: [{ actionId: "carry", inputId: "destination", targets: [{ id: "start", allowed: false, reasonCode: "no_change" }, { id: "finish", allowed: false, reasonCode: "closed" }] }],
    },
  };
}

test.beforeEach(async ({ context }) => { await createFamily(context, "3"); });

test("keyboard construction changes the on-stage artifact and an accepted response moves the actor", async ({ page }, testInfo) => {
  const saved = await begin(page, "observatory_floor");
  const grid = saved.objects.find(value => value.kind === "grid")!;
  let view = stage(saved, grid.id);
  const cellIds = saved.stateSlots.find(value => value.id === grid.bindings.cells)!.options!;
  view.stageView!.surfaces = [{
    id: "bridge-planks", label: "Crossing planks", objectId: grid.id, locationId: null, connectionId: "crossing",
    kind: "grid", layout: "row", cellIds, actionId: "place-or-lift", inputId: "cell",
    cells: cellIds.map(id => ({ id, selected: false, allowed: true, reasonCode: null })),
  }];
  const bodies: { actionId: string; inputs: Record<string, string>; expectedRevision: number }[] = [];
  await page.route(`**${BASE}/sessions/${saved.id}`, route => route.fulfill({ json: view }));
  await page.route(`**${BASE}/sessions/${saved.id}/actions`, async route => {
    const body = route.request().postDataJSON();
    bodies.push(body);
    expect(body.expectedRevision).toBe(view.revision);
    view = structuredClone(view);
    view.revision += 1;
    view.actionCount += 1;
    if (body.actionId === "place-or-lift") {
      expect(body.inputs).toEqual({ cell: "r0c0" });
      view.state[grid.bindings.cells] = ["r0c0"];
      view.stageView!.surfaces![0].cells[0].selected = true;
      view.stageView!.connections[0].open = true;
      view.stageView!.entities[1].currentStatus = "active";
      view.stageView!.entities[1].reactionText = "The crossing is ready for the cart.";
      view.stageView!.actionTargets[0].targets[1].allowed = true;
      view.stageView!.reactions = [{ id: "ready", entityId: "construction", status: "active", text: "The crossing is ready for the cart." }];
    } else {
      expect(body.actionId).toBe("carry");
      expect(body.inputs).toEqual({ destination: "finish" });
      view.stageView!.entities[0].locationId = "finish";
      view.stageView!.entities[0].currentStatus = "complete";
      view.stageView!.entities[0].reactionText = "The parcel reached the other shore.";
      view.stageView!.reactions = [{ id: "arrived", entityId: "courier", status: "complete", text: "The parcel reached the other shore." }];
      view.status = "completed";
      view.goals[0].achieved = true;
    }
    await route.fulfill({ json: view });
  });
  await page.goto(`/kid/activity-preview/${saved.id}`);
  const world = page.getByRole("region", { name: "Playable world", exact: true });
  await expect(world).toBeVisible();
  await expect(page.locator('[data-world-representation="' + grid.id + '"] [data-shaded="true"]')).toHaveCount(0);
  await page.getByRole("button", { name: "Explore Parcel cart", exact: true }).press("Enter");
  await page.getByRole("button", { name: "Visit Other shore", exact: true }).press("Enter");
  await expect(page.getByText("That place is not available for this move yet. Try another approach.")).toBeVisible();
  expect(bodies).toHaveLength(0);
  const planks = page.locator('[data-world-surface="bridge-planks"]');
  await expect(planks.locator('[data-surface-cell]')).toHaveCount(cellIds.length);
  await expect(planks.locator('[data-surface-cell="r0c0"]')).toHaveAttribute("data-source-row", "0");
  await expect(planks.locator('[data-surface-cell="r0c0"]')).toHaveAttribute("data-source-column", "0");
  await planks.locator('button[data-surface-cell="r0c0"]').press("Space");
  await expect(planks.locator('[data-surface-cell="r0c0"]')).toHaveAttribute("data-selected", "true");
  await expect(page.locator('[data-world-representation="' + grid.id + '"] [data-shaded="true"]').first()).toBeVisible();
  await expect(page.locator('[data-world-connection="crossing"]')).toHaveAttribute("data-open", "true");
  await page.getByRole("button", { name: "Explore Construction table", exact: true }).press("Enter");
  await expect(page.getByRole("button", { name: "Lift tile at row 1, column 1", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Close object tools", exact: true }).press("Enter");
  await expect(page.getByRole("button", { name: "Explore Construction table", exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Explore Parcel cart", exact: true }).press("Enter");
  await page.getByRole("button", { name: "Visit Other shore", exact: true }).press("Enter");
  await expect(page.locator('[data-world-entity="courier"]')).toHaveAttribute("data-current-location", "finish");
  await expect.poll(() => page.locator('[data-world-entity="courier"]').evaluate(element => Math.abs(parseFloat(getComputedStyle(element).left) - parseFloat((element as HTMLElement).style.left)) < 0.5)).toBe(true);
  const arrived = await page.locator('[data-world-entity="courier"]').boundingBox();
  const destination = await page.locator('[data-world-entity="delivery"]').boundingBox();
  const bounds = await page.locator('[data-world-map]').boundingBox();
  expect(arrived && destination && bounds && arrived.x >= bounds.x && destination.x + destination.width <= bounds.x + bounds.width && arrived.x + arrived.width <= destination.x).toBe(true);
  await expect(page.getByRole("heading", { name: "Mission complete", exact: true })).toBeVisible();
  await expect(page.getByText("The parcel reached the other shore.").first()).toBeVisible();
  expect(bodies.map(value => value.actionId)).toEqual(["place-or-lift", "carry"]);
  await page.reload();
  await expect(page.locator('[data-world-entity="courier"]')).toHaveAttribute("data-current-location", "finish");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("controlled-world-mobile.png"), fullPage: true });
});

test("a generic discovery reveals a source tool and its actual selected clue appears on stage", async ({ page }) => {
  const saved = await begin(page, "trail_evidence");
  const component = saved.components[0];
  const board = saved.objects.find(value => component.objectIds.includes(value.id) && value.kind === "evidence_board")!;
  const passage = saved.materials.find(value => board.materialIds.includes(value.id) && value.kind === "passage")!;
  const choice = saved.actions.find(value => value.componentId === component.id && value.operation === "select_evidence")!;
  const clue = passage.items[1];
  let view = stage(saved, board.id);
  view.actions.push({ id: "inspect", componentId: "world-controls", operation: "inspect_location", inputs: [{ id: "location", kind: "choice", options: ["workbench"] }], label: "Open the archive" });
  view.stageView!.actionTargets.push({ actionId: "inspect", inputId: "location", targets: [{ id: "workbench", allowed: true, reasonCode: null }] });
  view.stageView!.locations[1].actionIds = ["inspect"];
  view.stageView!.tools[0].available = false;
  view.stageView!.entities[1].representationObjectId = null;
  view.components = view.components.filter(value => value.id !== component.id);
  view.materials = [];
  await page.route(`**${BASE}/sessions/${saved.id}`, route => route.fulfill({ json: view }));
  await page.route(`**${BASE}/sessions/${saved.id}/actions`, async route => {
    const body = route.request().postDataJSON();
    view = structuredClone(view);
    view.revision += 1;
    if (body.actionId === "inspect") {
      expect(body.inputs).toEqual({ location: "workbench" });
      view.stageView!.tools[0].available = true;
      view.stageView!.locations[1].inspected = true;
      view.stageView!.entities[1].currentStatus = "discovered";
      view.stageView!.entities[1].representationObjectId = board.id;
      view.components.push(component);
      view.materials = saved.materials;
    } else {
      expect(body.actionId).toBe(choice.id);
      expect(body.inputs).toEqual({ sentence: clue.id });
      view.state[board.bindings.selection] = clue.id;
    }
    await route.fulfill({ json: view });
  });
  await page.goto(`/kid/activity-preview/${saved.id}`);
  await page.getByRole("button", { name: "Explore Construction table", exact: true }).click();
  await expect(page.getByRole("button", { name: "Build the crossing · Not available yet", exact: true })).toBeDisabled();
  await expect(page.getByText(passage.text!, { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Visit Workshop", exact: true }).click();
  await page.getByRole("button", { name: "Open the archive", exact: true }).press("Enter");
  await page.getByRole("button", { name: "Explore Construction table", exact: true }).press("Enter");
  await expect(page.getByText(passage.text!, { exact: true })).toBeVisible();
  await page.getByRole("button", { name: clue.text, exact: true }).press("Enter");
  await expect(page.locator('[data-world-entity="construction"] [data-world-representation="' + board.id + '"]')).toHaveText(clue.text);
});

test("desktop contextual tools stay beside the map and reduced motion disables entity travel animation", async ({ page }, testInfo) => {
  const saved = await begin(page, "observatory_floor");
  const grid = saved.objects.find(value => value.kind === "grid")!;
  const view = stage(saved, grid.id);
  await page.route(`**${BASE}/sessions/${saved.id}`, route => route.fulfill({ json: view }));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`/kid/activity-preview/${saved.id}`);
  await page.getByRole("button", { name: "Explore Construction table", exact: true }).press("Enter");
  const map = await page.getByRole("group", { name: "World map", exact: true }).boundingBox();
  const panel = await page.getByRole("complementary", { name: "Selected world object", exact: true }).boundingBox();
  expect(map && panel && map.x + map.width <= panel.x).toBe(true);
  await expect(page.locator('[data-world-entity="courier"]')).toHaveCSS("transition-property", "none");
  await page.screenshot({ path: testInfo.outputPath("controlled-world-desktop.png"), fullPage: true });
});

test("a crowded edge location keeps every inventory object accessible without clipping its primary objects", async ({ page }) => {
  const saved = await begin(page, "observatory_floor");
  const grid = saved.objects.find(value => value.kind === "grid")!;
  const view = stage(saved, grid.id);
  view.stageView!.locations[0].x = 0;
  view.stageView!.locations[0].capacity = 8;
  for (const name of ["A", "B", "C", "D"]) view.stageView!.entities.push({
    id: `extra-${name}`, label: `Extra parcel ${name}`, kind: "object", asset: "parcel", objectId: null,
    representationObjectId: null, locationId: "start", currentStatus: "idle", reactionText: null, actionIds: [], toolComponentIds: [],
  });
  await page.route(`**${BASE}/sessions/${saved.id}`, route => route.fulfill({ json: view }));
  await page.goto(`/kid/activity-preview/${saved.id}`);
  await expect(page.locator('[data-world-location="start"]')).toContainText("5 here");
  const bounds = await page.locator('[data-world-map]').boundingBox();
  for (const id of ["courier", "extra-A", "extra-B"]) {
    const object = await page.locator(`[data-world-entity="${id}"]`).boundingBox();
    expect(object && bounds && object.x >= bounds.x && object.x + object.width <= bounds.x + bounds.width).toBe(true);
  }
  await page.getByRole("button", { name: "Visit Starting shore", exact: true }).press("Enter");
  await expect(page.locator('[data-world-inventory-entity]')).toHaveCount(5);
  await page.locator('[data-world-inventory-entity="extra-D"]').press("Enter");
  await expect(page.getByRole("button", { name: "Explore Extra parcel D", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Close object tools", exact: true }).press("Enter");
  await expect(page.getByRole("button", { name: "Visit Starting shore", exact: true })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("a device can be edited before explicitly choosing its separate placement action", async ({ page }) => {
  const saved = await begin(page, "observatory_floor");
  const grid = saved.objects.find(value => value.kind === "grid")!;
  let view = stage(saved, grid.id);
  view.actions.push({ id: "place-device", componentId: "world-controls", operation: "place_piece", objectIds: ["bench-piece"], inputs: [{ id: "destination", kind: "choice", options: ["workbench", "finish"] }], label: "Place this construction" });
  view.stageView!.entities[1].actionIds = ["place-device"];
  view.stageView!.actionTargets.push({ actionId: "place-device", inputId: "destination", targets: [{ id: "workbench", allowed: false, reasonCode: "no_change" }, { id: "finish", allowed: true, reasonCode: null }] });
  await page.route(`**${BASE}/sessions/${saved.id}`, route => route.fulfill({ json: view }));
  await page.route(`**${BASE}/sessions/${saved.id}/actions`, async route => {
    const body = route.request().postDataJSON();
    expect(body.actionId).toBe("place-device");
    expect(body.inputs).toEqual({ destination: "finish" });
    view = structuredClone(view);
    view.stageView!.entities[1].locationId = "finish";
    view.revision += 1;
    await route.fulfill({ json: view });
  });
  await page.goto(`/kid/activity-preview/${saved.id}`);
  await page.getByRole("button", { name: "Explore Construction table", exact: true }).press("Enter");
  await expect(page.getByRole("region", { name: "Rectangle area workspace", exact: true }).or(page.getByRole("region", { name: "Unit-square workspace", exact: true }))).toBeVisible();
  await expect(page.locator('[data-world-location="finish"]')).toHaveAttribute("data-move-target", "false");
  await page.locator('[data-world-action="place-device"]').press("Enter");
  await expect(page.getByRole("button", { name: "Visit Other shore", exact: true })).toBeFocused();
  await expect(page.locator('[data-world-location="finish"]')).toHaveAttribute("data-move-target", "true");
  await page.getByRole("button", { name: "Visit Other shore", exact: true }).press("Enter");
  await expect(page.locator('[data-world-entity="construction"]')).toHaveAttribute("data-current-location", "finish");
});

test("a connection mount shows wrong shape, matching partial shape, and covered fit at one fixed unit scale", async ({ page }, testInfo) => {
  const saved = await begin(page, "habitat_designer");
  const grid = saved.objects.find(value => value.kind === "grid")!;
  let view = stage(saved, grid.id);
  const resize = view.actions.find(value => value.operation === "resize_rectangle")!;
  view.stateSlots.find(value => value.id === grid.bindings.rows)!.maximum = 2;
  view.stateSlots.find(value => value.id === grid.bindings.columns)!.maximum = 4;
  view.state[grid.bindings.rows] = 2;
  view.state[grid.bindings.columns] = 2;
  view.state[grid.bindings.cells] = ["r0c0", "r0c1", "r1c0", "r1c1"];
  view.actions.push({ id: "place-unit", componentId: resize.componentId, operation: "toggle_tile", label: "Place or lift a square", inputs: [{ id: "cell", kind: "choice", options: ["r0c0", "r0c1", "r0c2", "r0c3", "r1c0", "r1c1", "r1c2", "r1c3"] }] });
  const updateProjection = () => {
    const rows = view.state[grid.bindings.rows] as number;
    const columns = view.state[grid.bindings.columns] as number;
    const covered = view.state[grid.bindings.cells] as string[];
    const fits = rows === 1 && columns === 4 && covered.length === 4;
    view.stageView!.connections[0].construction = { objectId: grid.id, rows: 1, columns: 4, requiredCells: 4, actualRows: rows, actualColumns: columns, coveredCells: covered.length, dimensionsMatch: rows === 1 && columns === 4, complete: covered.length === rows * columns, fits, sourceVisible: true };
    view.stageView!.connections[0].open = fits;
    view.stageView!.actionTargets[0].targets[1].allowed = fits;
    view.stageView!.surfaces = [{ id: "fitted-crossing", label: "Square crossing", objectId: grid.id, locationId: null, connectionId: "crossing", kind: "grid", layout: "object", cellIds: [], actionId: "place-unit", inputId: "cell", cells: Array.from({ length: rows }, (_, row) => Array.from({ length: columns }, (_, column) => ({ id: `r${row}c${column}`, selected: covered.includes(`r${row}c${column}`), allowed: true, reasonCode: null }))).flat() }];
  };
  updateProjection();
  const actions: string[] = [];
  await page.route(`**${BASE}/sessions/${saved.id}`, route => route.fulfill({ json: view }));
  await page.route(`**${BASE}/sessions/${saved.id}/actions`, async route => {
    const body = route.request().postDataJSON();
    actions.push(body.actionId);
    view = structuredClone(view);
    view.revision += 1;
    view.actionCount += 1;
    if (body.actionId === resize.id) {
      expect(body.inputs).toEqual({ rows: 1, columns: 4 });
      view.state[grid.bindings.rows] = 1;
      view.state[grid.bindings.columns] = 4;
      view.state[grid.bindings.cells] = [];
    } else if (body.actionId === "place-unit") {
      expect(Object.keys(body.inputs)).toEqual(["cell"]);
      view.state[grid.bindings.cells] = [...view.state[grid.bindings.cells] as string[], body.inputs.cell];
    } else {
      expect(body.actionId).toBe("carry");
      expect(body.inputs).toEqual({ destination: "finish" });
      view.stageView!.entities[0].locationId = "finish";
    }
    updateProjection();
    await route.fulfill({ json: view });
  });
  await page.goto(`/kid/activity-preview/${saved.id}`);
  const mount = page.locator('[data-world-surface="fitted-crossing"]');
  await expect(mount.locator('[data-construction-feedback]')).toHaveText("Your shape is 2 × 2. The space needs 1 × 4.");
  await expect(mount.locator('[data-target-cell]')).toHaveCount(4);
  await expect(mount.locator('[data-surface-cell]')).toHaveCount(4);
  await expect(page.locator('[data-world-connection="crossing"]')).toHaveAttribute("data-open", "false");
  const firstUnit = await mount.locator('[data-surface-cell="r0c0"]').boundingBox();
  const extraRow = await mount.locator('[data-surface-cell="r1c0"]').boundingBox();
  const targetLast = await mount.locator('[data-target-cell="r0c3"]').boundingBox();
  const targetFirst = await mount.locator('[data-target-cell="r0c0"]').boundingBox();
  expect(firstUnit && extraRow && targetLast && targetFirst).toBeTruthy();
  expect(Math.abs(firstUnit!.width - firstUnit!.height)).toBeLessThan(0.1);
  expect(firstUnit!.width).toBe(44);
  expect(targetFirst!.width).toBe(firstUnit!.width);
  expect(targetFirst!.height).toBe(firstUnit!.height);
  expect(extraRow!.y).toBeGreaterThanOrEqual(targetFirst!.y + targetFirst!.height);
  expect(targetLast!.x).toBeGreaterThan(firstUnit!.x + firstUnit!.width * 2);
  const targetCenterMatchesPath = async () => {
    const first = await mount.locator('[data-target-cell="r0c0"]').boundingBox();
    const last = await mount.locator('[data-target-cell="r0c3"]').boundingBox();
    const pathCenter = await page.locator('[data-world-connection="crossing"] polyline').evaluate(element => {
      const line = element as SVGPolylineElement;
      const matrix = line.getScreenCTM()!;
      const entry = line.points.getItem(1);
      const exit = line.points.getItem(2);
      const point = new DOMPoint((entry.x + exit.x) / 2, (entry.y + exit.y) / 2).matrixTransform(matrix);
      return { x: point.x, y: point.y };
    });
    if (!first || !last) return Infinity;
    return Math.max(Math.abs((first.x + last.x + last.width) / 2 - pathCenter.x), Math.abs(first.y + first.height / 2 - pathCenter.y));
  };
  await expect.poll(targetCenterMatchesPath).toBeLessThan(0.5);
  await page.screenshot({ path: testInfo.outputPath("controlled-fit-wrong-shape-mobile.png"), fullPage: true });
  await page.getByRole("button", { name: "Open Square crossing tools", exact: true }).press("Enter");
  const shape = page.getByRole("form", { name: "Rectangle builder", exact: true });
  await shape.getByRole("spinbutton", { name: "Rows", exact: true }).fill("1");
  await shape.getByRole("spinbutton", { name: "Columns", exact: true }).fill("4");
  await shape.getByRole("button", { name: resize.label, exact: true }).press("Enter");
  await expect(mount.locator('[data-construction-feedback]')).toHaveText("Shape fits. Cover all 4 unit squares.");
  await page.getByRole("button", { name: "Back to the world", exact: true }).press("Enter");
  const reshapedUnit = await mount.locator('[data-surface-cell="r0c0"]').boundingBox();
  const sameTarget = await mount.locator('[data-target-cell="r0c3"]').boundingBox();
  expect(reshapedUnit!.width).toBe(firstUnit!.width);
  expect(sameTarget!.width).toBe(targetLast!.width);
  await expect.poll(targetCenterMatchesPath).toBeLessThan(0.5);
  for (const cell of ["r0c0", "r0c1", "r0c2"]) {
    await expect(mount.locator(`button[data-surface-cell="${cell}"]`)).toBeEnabled();
    await mount.locator(`button[data-surface-cell="${cell}"]`).press("Space");
    await expect(mount.locator(`[data-surface-cell="${cell}"]`)).toHaveAttribute("data-selected", "true");
  }
  await expect(page.locator('[data-world-connection="crossing"]')).toHaveAttribute("data-open", "false");
  await expect(mount).toHaveAttribute("data-construction-fits", "false");
  await expect(mount.locator('button[data-surface-cell="r0c3"]')).toBeEnabled();
  await mount.locator('button[data-surface-cell="r0c3"]').press("Enter");
  await expect(mount.locator('[data-construction-feedback]')).toHaveText("Fits: all 4 unit squares are covered.");
  await expect(page.locator('[data-world-connection="crossing"]')).toHaveAttribute("data-open", "true");
  await page.locator('[data-world-entity="courier"]').press("Enter");
  await page.locator('[data-world-location="finish"]').press("Enter");
  await expect(page.locator('[data-world-entity="courier"]')).toHaveAttribute("data-current-location", "finish");
  expect(actions).toEqual([resize.id, "place-unit", "place-unit", "place-unit", "place-unit", "carry"]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator('[data-world-map]')).toBeVisible();
  await expect.poll(targetCenterMatchesPath).toBeLessThan(0.5);
  await expect.poll(() => page.locator('[data-world-entity="courier"]').evaluate(element => Math.abs(parseFloat(getComputedStyle(element).left) - parseFloat((element as HTMLElement).style.left)) < 0.5)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("controlled-fit-correct-shape-desktop.png"), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("a public connection target renders without revealing its hidden construction", async ({ page }) => {
  const saved = await begin(page, "observatory_floor");
  const grid = saved.objects.find(value => value.kind === "grid")!;
  const view = stage(saved, grid.id);
  view.stageView!.connections[0].construction = { objectId: grid.id, rows: 1, columns: 4, requiredCells: 4, actualRows: null, actualColumns: null, coveredCells: null, dimensionsMatch: null, complete: null, fits: null, sourceVisible: false };
  view.stageView!.entities[1].representationObjectId = null;
  view.stageView!.tools[0].available = false;
  view.objects = [];
  view.components = view.components.filter(value => value.kind === "world_stage");
  view.materials = [];
  view.state = {};
  view.stateSlots = [];
  await page.route(`**${BASE}/sessions/${saved.id}`, route => route.fulfill({ json: view }));
  await page.goto(`/kid/activity-preview/${saved.id}`);
  const mount = page.locator('[data-world-surface="target-crossing"]');
  await expect(mount.locator('[data-target-cell]')).toHaveCount(4);
  await expect(mount.locator('[data-surface-cell]')).toHaveCount(0);
  await expect(mount.locator('button')).toHaveCount(0);
  await expect(mount.locator('[data-construction-feedback]')).toHaveText("Build a construction to fill this space.");
  await expect(mount).not.toContainText("0/0");
});

test("multiple physical crossings and a product sign leave every native tile and caption clear", async ({ page }, testInfo) => {
  const saved = await begin(page, "observatory_floor");
  // This sanitized PUBLIC pristine projection reproduces the admitted game's
  // layout. Responses below are UI stubs, not live admission or scoring proof.
  let view = { ...structuredClone(branchingConstruction), id: saved.id } as unknown as ProgramSession;
  const grid = view.objects.find(value => value.kind === "grid")!;
  const updateProjection = () => {
    const rows = view.state[grid.bindings.rows] as number;
    const columns = view.state[grid.bindings.columns] as number;
    const covered = view.state[grid.bindings.cells] as string[];
    for (const connection of view.stageView!.connections) {
      const target = connection.construction!;
      target.actualRows = rows;
      target.actualColumns = columns;
      target.coveredCells = covered.length;
      target.dimensionsMatch = rows === target.rows && columns === target.columns;
      target.complete = covered.length === rows * columns;
      target.fits = target.dimensionsMatch && target.complete;
      connection.open = target.fits;
    }
    for (const surface of view.stageView!.surfaces!.filter(value => value.kind === "grid")) {
      surface.actionId = "tile";
      surface.inputId = "cell";
      surface.cells = Array.from({ length: rows }, (_, row) => Array.from({ length: columns }, (_, column) => ({ id: `r${row}c${column}`, selected: covered.includes(`r${row}c${column}`), allowed: true, reasonCode: null }))).flat();
    }
  };
  await page.route(`**${BASE}/sessions/${saved.id}`, route => route.fulfill({ json: view }));
  await page.route(`**${BASE}/sessions/${saved.id}/actions`, async route => {
    const body = route.request().postDataJSON();
    expect(body.actionId).toBe("tile");
    expect(body.expectedRevision).toBe(view.revision);
    view = structuredClone(view);
    const covered = view.state[grid.bindings.cells] as string[];
    view.state[grid.bindings.cells] = covered.includes(body.inputs.cell) ? covered.filter(value => value !== body.inputs.cell) : [...covered, body.inputs.cell];
    view.revision += 1;
    updateProjection();
    await route.fulfill({ json: view });
  });
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 1000 }]) {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const [rows, columns] of [[1, 1], [2, 5], [2, 6], [3, 4]]) {
      view.state[grid.bindings.rows] = rows;
      view.state[grid.bindings.columns] = columns;
      view.state[grid.bindings.cells] = [];
      updateProjection();
      await page.goto(`/kid/activity-preview/${saved.id}`);
      await expect(page.locator('[data-world-map]')).toHaveAttribute("data-layout-ready", "true");
      const geometryProblems = () => page.evaluate(() => {
        const rectangle = (element: Element) => element.getBoundingClientRect();
        const area = (a: DOMRect, b: DOMRect) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
        const mounts = Array.from(document.querySelectorAll('[data-world-surface]'));
        const obstacles = Array.from(document.querySelectorAll('[data-world-entity], [data-world-location]'));
        const problems: string[] = [];
        const pieces = (element: Element) => element.classList.contains("world-construction-surface") ? Array.from(element.children) : [element];
        for (let index = 0; index < mounts.length; index++) {
          const surface = mounts[index];
          for (const part of pieces(surface)) {
            for (const obstacle of obstacles) if (area(rectangle(part), rectangle(obstacle)) > 1) problems.push(`${surface.getAttribute("data-world-surface")} overlaps ${obstacle.getAttribute("data-world-entity") || obstacle.getAttribute("data-world-location")}`);
            for (const other of mounts.slice(index + 1)) for (const peer of pieces(other)) if (area(rectangle(part), rectangle(peer)) > 1) problems.push(`${surface.getAttribute("data-world-surface")} overlaps ${other.getAttribute("data-world-surface")}`);
          }
        }
        return problems;
      });
      await expect.poll(geometryProblems).toEqual([]);
      for (const id of ["long-mount", "wide-mount"]) {
        const mount = page.locator(`[data-world-surface="${id}"]`);
        await expect(mount.locator('button[data-surface-cell]')).toHaveCount(rows * columns);
        for (const cell of await mount.locator('button[data-surface-cell]').all()) await cell.click({ trial: true });
      }
      await page.locator('[data-world-surface="long-mount"] button[data-surface-cell="r0c0"]').click();
      await expect(page.locator('[data-world-surface="wide-mount"] [data-surface-cell="r0c0"]')).toHaveAttribute("data-selected", "true");
      await page.locator('[data-world-surface="wide-mount"] button[data-surface-cell="r0c0"]').click();
      await expect(page.locator('[data-world-surface="long-mount"] [data-surface-cell="r0c0"]')).toHaveAttribute("data-selected", "false");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (rows === 2 && columns === 6) {
        await page.locator('[data-world-map]').scrollIntoViewIfNeeded();
        await page.screenshot({ path: testInfo.outputPath(`controlled-multiple-crossings-${viewport.width < 500 ? "mobile" : "desktop"}.png`), fullPage: true });
      }
    }
  }
});

test("an integer pointer click reaches a rotated native tile while its label and caption stay outside", async ({ page }, testInfo) => {
  const saved = await begin(page, "observatory_floor");
  const grid = saved.objects.find(value => value.kind === "grid")!;
  let view = stage(saved, grid.id);
  view.stageView!.locations[0].x = 35;
  view.stageView!.locations[0].y = 90;
  view.stageView!.locations[1].x = 8;
  view.stageView!.locations[1].y = 35;
  view.stageView!.locations[2].x = 65;
  view.stageView!.locations[2].y = 10;
  const tile = view.actions.find(value => value.operation === "toggle_tile")!;
  view.stageView!.surfaces = [{ id: "rotated-row", label: "Top row", objectId: grid.id, locationId: null, connectionId: "crossing", kind: "grid", layout: "row", cellIds: ["r0c0", "r0c1", "r0c2"], actionId: tile.id, inputId: "cell", cells: ["r0c0", "r0c1", "r0c2"].map(id => ({ id, selected: false, allowed: true, reasonCode: null })) }];
  const bodies: { actionId: string; inputs: { cell: string } }[] = [];
  await page.route(`**${BASE}/sessions/${saved.id}`, route => route.fulfill({ json: view }));
  await page.route(`**${BASE}/sessions/${saved.id}/actions`, async route => {
    const body = route.request().postDataJSON();
    expect(body.actionId).toBe(tile.id);
    expect(body.inputs).toEqual({ cell: "r0c0" });
    bodies.push(body);
    view = structuredClone(view);
    view.revision += 1;
    view.stageView!.surfaces![0].cells[0].selected = !view.stageView!.surfaces![0].cells[0].selected;
    await route.fulfill({ json: view });
  });
  for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 900 }]) {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/kid/activity-preview/${saved.id}`);
    await expect(page.locator('[data-world-map]')).toHaveAttribute("data-layout-ready", "true");
    const mount = page.locator('[data-world-surface="rotated-row"]');
    await expect(mount).toHaveClass(/world-angled-surface/);
    const gridBox = await mount.locator('[data-surface-grid]').boundingBox();
    const label = await mount.locator('.world-surface-label').boundingBox();
    const caption = await mount.locator('.world-surface-caption').boundingBox();
    expect(gridBox && label && caption).toBeTruthy();
    expect(label!.y + label!.height).toBeLessThanOrEqual(gridBox!.y);
    expect(caption!.y).toBeGreaterThanOrEqual(gridBox!.y + gridBox!.height);
    const native = mount.locator('button[data-surface-cell="r0c0"]');
    await native.scrollIntoViewIfNeeded();
    await expect.poll(() => native.evaluate(element => {
      const box = element.getBoundingClientRect();
      const x = Math.floor(box.x + box.width / 2);
      const y = Math.floor(box.y + box.height / 2);
      return x >= 0 && x < innerWidth && y >= 0 && y < innerHeight && document.elementFromPoint(x, y)?.closest("button") === element;
    })).toBe(true);
    await page.evaluate(() => {
      (window as Window & { nativeTileClicks?: string[] }).nativeTileClicks = [];
      document.addEventListener("click", event => {
        const button = event.target instanceof Element ? event.target.closest("button[data-surface-cell]") : null;
        if (button) (window as Window & { nativeTileClicks?: string[] }).nativeTileClicks!.push(button.getAttribute("data-surface-cell")!);
      }, { once: true, capture: true });
    });
    const box = await native.boundingBox();
    const count = bodies.length;
    const selected = await native.getAttribute("data-selected");
    await page.mouse.click(Math.floor(box!.x + box!.width / 2), Math.floor(box!.y + box!.height / 2));
    await expect.poll(() => bodies.length).toBe(count + 1);
    await expect(native).toHaveAttribute("data-selected", selected === "true" ? "false" : "true");
    expect(await page.evaluate(() => (window as Window & { nativeTileClicks?: string[] }).nativeTileClicks)).toEqual(["r0c0"]);
    await page.screenshot({ path: testInfo.outputPath(`controlled-rotated-native-pointer-${viewport.width < 500 ? "mobile" : "desktop"}.png`), fullPage: true });
  }
});

test("read-only fraction mounts show complete source wholes without requiring a tool component", async ({ page }, testInfo) => {
  const saved = await begin(page, "observatory_floor");
  const grid = saved.objects.find(value => value.kind === "grid")!;
  const view = stage(saved, grid.id);
  view.fractionViews = [];
  view.stageView!.surfaces = [];
  for (const [id, denominator, selected, locationId] of [["first-guide", 5, 2, "start"], ["second-guide", 10, 4, "finish"]] as const) {
    const pieces = Array.from({ length: selected }, (_, index) => `p${index}`);
    view.objects.push({ id, kind: "fraction_strip", bindings: { denominator: `${id}-denominator`, pieces: `${id}-pieces` }, materialIds: [], width: 5, wholeId: "one-comparison-whole" });
    view.state[`${id}-denominator`] = denominator;
    view.state[`${id}-pieces`] = pieces;
    view.fractionViews.push({ objectId: id, wholeId: "one-comparison-whole", numerator: selected, denominator, pieces, editable: false, width: 5, allowedDenominators: [] });
    const cellIds = Array.from({ length: denominator }, (_, index) => `p${index}`);
    view.stageView!.surfaces.push({ id, label: id === "first-guide" ? "First grate" : "Second grate", objectId: id, locationId, connectionId: null, kind: "fraction_strip", layout: "object", cellIds, actionId: null, inputId: null, cells: cellIds.map(cell => ({ id: cell, selected: pieces.includes(cell), allowed: false, reasonCode: null })) });
  }
  await page.route(`**${BASE}/sessions/${saved.id}`, route => route.fulfill({ json: view }));
  await page.goto(`/kid/activity-preview/${saved.id}`);
  for (const [id, count, selected] of [["first-guide", 5, 2], ["second-guide", 10, 4]] as const) {
    const mount = page.locator(`[data-world-surface="${id}"]`);
    await expect(mount.locator('[data-surface-cell]')).toHaveCount(count);
    await expect(mount.locator('[data-selected="true"]')).toHaveCount(selected);
    await expect(mount.locator('button[data-surface-cell]')).toHaveCount(0);
    await expect(mount.getByRole("button")).toHaveCount(0);
  }
  const grids = page.locator('[data-world-surface] [data-surface-grid]');
  const sizes = await grids.evaluateAll(elements => elements.map(element => { const box = element.getBoundingClientRect(); return { width: box.width, height: box.height }; }));
  expect(sizes[0]).toEqual(sizes[1]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("controlled-fraction-mounts-mobile.png"), fullPage: true });
});
