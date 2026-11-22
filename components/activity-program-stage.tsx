"use client";

import { BookOpen, Box, Circle, Cog, Flag, Flower2, Footprints, Home, Lightbulb, MapPin, MoveRight, Package, PersonStanding, Search, Ship, ShoppingCart, Sparkles, Trees, Unlock, X, type LucideIcon } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type DragEvent } from "react";
import type { ProgramAction, ProgramInputs, ProgramObject, ProgramSession, ProgramStageAsset, ProgramStageEntity, ProgramStageSurface } from "@/lib/activity-program-types";
import { ActivityProgramControl } from "./activity-program-controls";
import { ActivityProgramSurface, surfaceGeometry } from "./activity-program-surfaces";

const ASSET_ICONS: Record<ProgramStageAsset, LucideIcon> = {
  dot: Circle, person: PersonStanding, cart: ShoppingCart, boat: Ship,
  parcel: Package, lens: Search, bridge: Footprints, gate: Unlock,
  home: Home, tree: Trees, lamp: Lightbulb, book: BookOpen,
  clue: Search, flag: Flag, flower: Flower2, gear: Cog,
};
const WORLD_OPERATIONS = new Set(["move_actor", "place_piece", "inspect_location"]);
const DRAG_TYPE = "application/x-sidekick-world-entity";
interface Rectangle { x: number; y: number; width: number; height: number }
function overlap(a: Rectangle, b: Rectangle) {
  return Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x))
    * Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
}

interface StageProps {
  session: ProgramSession;
  disabled: boolean;
  onAction: (action: ProgramAction, inputs: ProgramInputs) => Promise<boolean>;
}

function Asset({ name, size = 27 }: { name: ProgramStageAsset; size?: number }) {
  const Icon = ASSET_ICONS[name] || Circle;
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}

function integer(session: ProgramSession, object: ProgramObject, role: string) {
  const value = session.state[object.bindings[role]];
  return typeof value === "number" ? value : 0;
}

/** These are views of actual owned constructions, not success/reward icons. */
function Representation({ session, objectId }: { session: ProgramSession; objectId: string | null }) {
  const object = session.objects.find(value => value.id === objectId);
  if (!object) return null;
  if (object.kind === "fraction_strip") {
    const fraction = session.fractionViews?.find(value => value.objectId === object.id);
    if (!fraction) return null;
    const rows = fraction.denominator / fraction.width;
    return <span className="world-representation world-fraction" data-world-representation={object.id} aria-label={`${fraction.numerator}/${fraction.denominator} shaded`}>
      <span className="world-fraction-grid" style={{ "--mini-columns": fraction.width, "--mini-rows": rows } as CSSProperties}>{Array.from({ length: fraction.denominator }, (_, index) => <span key={index} data-shaded={fraction.pieces.includes(`p${index}`)} />)}</span>
      <strong>{fraction.numerator}/{fraction.denominator}</strong>
    </span>;
  }
  if (object.kind === "grid") {
    const rows = integer(session, object, "rows");
    const columns = integer(session, object, "columns");
    const cells = session.state[object.bindings.cells];
    const tiled = new Set(Array.isArray(cells) ? cells : []);
    const tileComponent = session.components.find(value => value.objectIds.includes(object.id));
    const editableTiles = session.actions.some(value => value.componentId === tileComponent?.id && value.operation === "toggle_tile");
    return <span className="world-representation world-grid" data-world-representation={object.id} aria-label={`${rows} rows and ${columns} columns`}><span className="world-grid-mini" style={{ "--mini-columns": columns, "--mini-rows": rows } as CSSProperties}>{Array.from({ length: rows }, (_, row) => Array.from({ length: columns }, (_, column) => <span key={`${row}-${column}`} data-shaded={!editableTiles || tiled.has(`r${row}c${column}`)} />))}</span><strong>{rows} × {columns}</strong></span>;
  }
  if (object.kind === "equation") return <span className="world-representation world-equation" data-world-representation={object.id}>{integer(session, object, "left")} × {integer(session, object, "right")} = {integer(session, object, "result")}</span>;
  if (object.kind === "quantity_pool") return <span className="world-representation world-quantity" data-world-representation={object.id}><Package size={17} aria-hidden="true" /><strong>{integer(session, object, "count")}</strong></span>;
  if (object.kind === "evidence_board") {
    const selection = session.state[object.bindings.selection];
    const materials = session.materials.filter(value => object.materialIds.includes(value.id));
    const clue = materials.flatMap(value => value.items).find(value => value.id === selection);
    return <span className="world-representation world-written" data-world-representation={object.id} title={clue?.text}>{clue ? <><Search size={14} aria-hidden="true" />{clue.text}</> : "Choose a clue"}</span>;
  }
  if (object.kind === "text_artifact") {
    const text = session.state[object.bindings.text];
    return <span className="world-representation world-written" data-world-representation={object.id} title={typeof text === "string" ? text : undefined}>{typeof text === "string" && text ? text : "Your words appear here"}</span>;
  }
  return null;
}

export function ActivityProgramStage({ session, disabled, onAction }: StageProps) {
  const world = session.stageView;
  const [selection, setSelection] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [armedAction, setArmedAction] = useState<string | null>(null);
  const [localNotice, setLocalNotice] = useState("");
  const entityButtons = useRef(new Map<string, HTMLButtonElement>());
  const locationButtons = useRef(new Map<string, HTMLButtonElement>());
  const contextPanel = useRef<HTMLElement | null>(null);
  const mapInner = useRef<HTMLDivElement | null>(null);
  const [mapSize, setMapSize] = useState({ width: 100, height: 100, left: 52, top: 120, outerWidth: 204, outerHeight: 298 });
  const [layoutReady, setLayoutReady] = useState(false);
  useLayoutEffect(() => {
    const element = mapInner.current;
    if (!element) return;
    const measure = () => {
      const rectangle = element.getBoundingClientRect();
      const next = { width: rectangle.width, height: rectangle.height, left: element.offsetLeft, top: element.offsetTop, outerWidth: element.parentElement?.clientWidth || rectangle.width, outerHeight: element.parentElement?.clientHeight || rectangle.height };
      setMapSize(previous => Object.entries(next).every(([key, value]) => previous[key as keyof typeof previous] === value) ? previous : next);
    };
    measure();
    const firstFrame = requestAnimationFrame(() => setLayoutReady(true));
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => { observer.disconnect(); cancelAnimationFrame(firstFrame); };
  }, [Boolean(world)]);
  const hasSelectedTool = Boolean(world?.tools.some(value => value.entityId === selection && value.available));
  const hasSelectedInspection = Boolean(world?.locations.find(value => value.id === selection)?.actionIds.length);
  useEffect(() => {
    if (!selection || (!hasSelectedTool && !hasSelectedInspection) || !window.matchMedia("(max-width: 1049px)").matches) return;
    const frame = requestAnimationFrame(() => contextPanel.current?.scrollIntoView({
      block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    }));
    return () => cancelAnimationFrame(frame);
  }, [selection, activeTool, hasSelectedTool, hasSelectedInspection]);
  if (!world) return null;
  const pathMountCount = new Set([
    ...(world.surfaces || []).flatMap(value => value.connectionId ? [value.connectionId] : []),
    ...world.connections.flatMap(value => value.construction ? [value.id] : []),
  ]).size;
  const locationMountCount = (world.surfaces || []).filter(value => value.locationId).length;
  const extraMobileHeight = Math.max(0, pathMountCount - 1) * 400 + (pathMountCount > 1 ? locationMountCount * 160 : 0);
  const extraDesktopHeight = Math.max(0, pathMountCount - 1) * 220 + (pathMountCount > 1 ? locationMountCount * 80 : 0);
  const locations = new Map(world.locations.map(value => [value.id, value]));
  const groups = new Map(world.locations.map(value => {
    const all = world.entities.filter(item => item.locationId === value.id);
    // Keep the active object and real constructions visible. Larger inventories
    // remain fully available through the location's native contents buttons.
    const priority = [...all.filter(item => item.representationObjectId), ...all.filter(item => item.kind === "actor"), ...all];
    let visible = Array.from(new Map(priority.map(item => [item.id, item])).values()).slice(0, 3);
    const selected = all.find(item => item.id === selection);
    if (selected && !visible.some(item => item.id === selected.id)) visible = [...visible.slice(0, 2), selected];
    const spacing = Math.min(84, mapSize.width / Math.max(1, visible.length - 1));
    const halfFan = Math.max(0, visible.length - 1) * spacing / 2;
    const x = Math.max(halfFan, Math.min(mapSize.width - halfFan, value.x * mapSize.width / 100));
    return [value.id, { all, visible, spacing, x, y: value.y * mapSize.height / 100 }];
  }));
  const occupied: Rectangle[] = Array.from(groups.values()).flatMap(group => [
    { x: group.x - 46, y: group.y - 22, width: 92, height: 84 },
    ...group.visible.map((item, index) => ({ x: group.x + (index - (group.visible.length - 1) / 2) * group.spacing - 47, y: group.y - (item.representationObjectId ? 138 : 110), width: 94, height: item.representationObjectId ? 146 : 118 })),
  ]);
  const visibleSurfaces = [...(world.surfaces || [])];
  for (const connection of world.connections) {
    if (connection.construction && !visibleSurfaces.some(value => value.connectionId === connection.id && value.objectId === connection.construction!.objectId)) {
      // A public destination footprint remains visible while its construction
      // is hidden. No hidden source object, dimensions or cells are inferred.
      visibleSurfaces.push({ id: `target-${connection.id}`, label: "Construction space", objectId: connection.construction.objectId, locationId: null, connectionId: connection.id, kind: "grid", layout: "object", cellIds: [], actionId: null, inputId: null, cells: [] });
    }
  }
  const surfaces = visibleSurfaces.map(surface => {
    const edge = world.connections.find(value => value.id === surface.connectionId);
    const from = edge ? groups.get(edge.fromLocation) : undefined;
    const to = edge ? groups.get(edge.toLocation) : undefined;
    const at = surface.locationId ? groups.get(surface.locationId) : undefined;
    const pathLength = from && to ? Math.hypot(to.x - from.x, to.y - from.y) : undefined;
    const geometry = surfaceGeometry(session, surface, pathLength);
    const anchor = at || (from && to ? { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 } : { x: mapSize.width / 2, y: mapSize.height / 2 });
    const angle = from && to && surface.layout !== "object" && !geometry.construction ? Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI - (surface.layout === "column" ? 90 : 0) : 0;
    const radians = angle * Math.PI / 180;
    const surfaceWidth = geometry.width;
    const surfaceHeight = geometry.height + 40;
    const width = Math.abs(surfaceWidth * Math.cos(radians)) + Math.abs(surfaceHeight * Math.sin(radians));
    const height = Math.abs(surfaceWidth * Math.sin(radians)) + Math.abs(surfaceHeight * Math.cos(radians));
    const angledGrid = ["grid", "fraction_strip"].includes(surface.kind) && Math.abs(angle) > 0.1;
    const gridWidth = Math.abs(geometry.width * Math.cos(radians)) + Math.abs(geometry.height * Math.sin(radians));
    const gridHeight = Math.abs(geometry.width * Math.sin(radians)) + Math.abs(geometry.height * Math.cos(radians));
    const extents = geometry.constructionAnchor || (angledGrid ? { left: Math.max(88, gridWidth / 2), right: Math.max(88, gridWidth / 2), top: gridHeight / 2 + 28, bottom: gridHeight / 2 + 36 } : { left: width / 2, right: width / 2, top: height / 2, bottom: height / 2 });
    const rectangleAt = (point: { x: number; y: number }) => ({ x: point.x - extents.left, y: point.y - extents.top, width: extents.left + extents.right, height: extents.top + extents.bottom });
    const clampPoint = (point: { x: number; y: number }) => ({
      x: Math.max(extents.left + 8 - mapSize.left, Math.min(mapSize.outerWidth - mapSize.left - extents.right - 8, point.x)),
      y: Math.max(extents.top + 8 - mapSize.top, Math.min(mapSize.outerHeight - mapSize.top - extents.bottom - 8, point.y)),
    });
    const choices = (at ? [
      { x: anchor.x, y: anchor.y - 82 }, { x: anchor.x, y: anchor.y + 92 },
      { x: anchor.x - width / 2 - 62, y: anchor.y - 25 }, { x: anchor.x + width / 2 + 62, y: anchor.y - 25 },
      { x: anchor.x, y: anchor.y - 146 }, { x: anchor.x, y: anchor.y + 155 },
    ] : [anchor]).map(clampPoint);
    // Physical mounts need their own clear lanes, including path mounts. The
    // routes below follow their actual placement instead of drawing elsewhere.
    const first = clampPoint({ x: -Infinity, y: -Infinity });
    const last = clampPoint({ x: Infinity, y: Infinity });
    for (let row = first.y; row <= last.y + 0.1; row += 24) {
      for (let column = 0; column <= 4; column += 1) choices.push({ x: first.x + (last.x - first.x) * column / 4, y: row });
    }
    choices.push(clampPoint({ x: anchor.x, y: last.y }));
    const center = choices.sort((a, b) => {
      const score = (point: { x: number; y: number }) => occupied.reduce((sum, rectangle) => sum + overlap(rectangleAt(point), rectangle), 0) * 10000 + Math.hypot(point.x - anchor.x, point.y - anchor.y) * 0.15;
      return score(a) - score(b);
    })[0];
    occupied.push(rectangleAt(center));
    return { surface, geometry, ...center, angle, anchor };
  });
  const entity = world.entities.find(value => value.id === selection);
  const location = world.locations.find(value => value.id === selection);
  const selectedActions = session.actions.filter(value => entity?.actionIds.includes(value.id) && WORLD_OPERATIONS.has(value.operation));
  const armed = session.actions.find(value => value.id === armedAction);
  const targets = world.actionTargets.find(value => value.actionId === armed?.id);
  const tools = world.tools.filter(value => value.entityId === entity?.id);
  const selectedTool = tools.find(value => value.componentId === activeTool && value.available)
    || (tools.filter(value => value.available).length === 1 ? tools.find(value => value.available) : undefined);
  const tool = session.components.find(value => value.id === selectedTool?.componentId);
  const inspection = session.actions.filter(value => value.operation === "inspect_location");
  const completeReaction = world.reactions.find(value => value.status === "complete")?.text
    || world.entities.find(value => value.currentStatus === "complete" && value.reactionText)?.reactionText;

  function chooseEntity(value: ProgramStageEntity) {
    setSelection(value.id);
    setActiveTool(null);
    const actions = session.actions.filter(action => value.actionIds.includes(action.id) && ["move_actor", "place_piece"].includes(action.operation));
    const opensTool = world!.tools.some(tool => tool.entityId === value.id && tool.available);
    const automaticMove = actions.length === 1 && !disabled && !opensTool;
    setArmedAction(automaticMove ? actions[0].id : null);
    setLocalNotice(automaticMove ? "Choose a destination on the map." : "");
  }

  function armWorldAction(action: ProgramAction) {
    setArmedAction(action.id);
    setLocalNotice(action.operation === "inspect_location" ? "Choose a place to investigate." : "Choose a destination on the map.");
    const next = world!.actionTargets.find(value => value.actionId === action.id)?.targets.find(value => value.allowed);
    const focus = next ? locationButtons.current.get(next.id) : entity ? entityButtons.current.get(entity.id) : null;
    focus?.focus();
  }

  function openSurface(surface: ProgramStageSurface) {
    const action = session.actions.find(value => value.id === surface.actionId);
    const component = session.components.find(value => value.id === action?.componentId)
      || session.components.find(value => value.objectIds.includes(surface.objectId) && value.kind !== "world_stage");
    const attachment = world!.tools.find(value => value.componentId === component?.id && value.available);
    const owner = world!.entities.find(value => value.id === attachment?.entityId);
    if (owner && component) { chooseEntity(owner); setActiveTool(component.id); }
  }

  async function useLocation(locationId: string, actionOverride?: ProgramAction) {
    const action = actionOverride || armed;
    if (disabled || !action) { setSelection(locationId); setActiveTool(null); setArmedAction(null); return; }
    const targeting = world!.actionTargets.find(value => value.actionId === action.id);
    const target = targeting?.targets.find(value => value.id === locationId);
    if (!target?.allowed) { setLocalNotice("That place is not available for this move yet. Try another approach."); return; }
    const input = targeting?.inputId || (action.operation === "inspect_location" ? "location" : "destination");
    if (await onAction(action, { [input]: locationId })) {
      setArmedAction(null);
      setLocalNotice(action.operation === "inspect_location" ? "Take a look at what changed." : "");
    }
  }

  function closeContext() {
    if (selection) {
      const selectedEntity = world!.entities.find(value => value.id === selection);
      const siblings = world!.entities.filter(value => value.locationId === selectedEntity?.locationId);
      const normallyVisible = Array.from(new Map([...siblings.filter(value => value.representationObjectId), ...siblings.filter(value => value.kind === "actor"), ...siblings].map(value => [value.id, value])).values()).slice(0, 3);
      const target = selectedEntity && !normallyVisible.some(value => value.id === selectedEntity.id)
        ? locationButtons.current.get(selectedEntity.locationId) : entityButtons.current.get(selection) || locationButtons.current.get(selection);
      target?.focus();
    }
    setSelection(null); setActiveTool(null); setArmedAction(null);
  }

  function dropAt(event: DragEvent<HTMLButtonElement>, locationId: string) {
    event.preventDefault();
    try {
      const id = event.dataTransfer.getData(DRAG_TYPE);
      const source = world!.entities.find(value => value.id === id);
      const action = session.actions.find(value => source?.actionIds.includes(value.id) && ["move_actor", "place_piece"].includes(value.operation));
      if (source && action) { setSelection(source.id); void useLocation(locationId, action); }
    } catch { /* World references never contain executable browser content. */ }
  }

  return <section className="program-world" aria-label="Playable world">
    <div className="world-play-layout">
      <div className="world-main">
        <div className="world-instruction" role="status" aria-live="polite"><MapPin size={19} aria-hidden="true" /><p>{localNotice || (armed ? "Choose a destination on the map." : "Tap an object or a place to explore.")}</p>{armed ? <button className="text-button" onClick={() => { setArmedAction(null); setLocalNotice(""); }}>Cancel move</button> : null}</div>
        <div className="world-map" role="group" aria-label="World map" data-world-map data-layout-ready={layoutReady} data-has-surfaces={surfaces.length > 0} data-has-mounts={surfaces.some(value => Boolean(value.surface.locationId))} style={{ "--world-extra-mobile-height": `${extraMobileHeight}px`, "--world-extra-desktop-height": `${extraDesktopHeight}px` } as CSSProperties}>
          <div className="world-map-surface" />
          <div ref={mapInner} className="world-map-inner">
            <svg className="world-connections" viewBox={`0 0 ${mapSize.width} ${mapSize.height}`} preserveAspectRatio="none" aria-hidden="true">{world.connections.map(connection => {
              const from = groups.get(connection.fromLocation); const to = groups.get(connection.toLocation);
              if (!from || !to) return null;
              const mount = surfaces.find(value => value.surface.connectionId === connection.id);
              const style = connection.open ? "world-path-open" : "world-path-closed";
              if (!mount) return <g key={connection.id} data-world-connection={connection.id} data-open={connection.open}><line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={style} /></g>;
              const construction = mount.geometry.construction;
              const width = construction ? mount.geometry.width * construction.columns / mount.geometry.columns : mount.geometry.width;
              const height = construction ? mount.geometry.height * construction.rows / mount.geometry.rows : mount.geometry.height;
              const horizontal = Math.abs(to.x - from.x) >= Math.abs(to.y - from.y);
              const radians = mount.angle * Math.PI / 180;
              const offset = !construction && mount.surface.layout === "row" ? { x: width * Math.cos(radians) / 2, y: width * Math.sin(radians) / 2 }
                : !construction && mount.surface.layout === "column" ? { x: -height * Math.sin(radians) / 2, y: height * Math.cos(radians) / 2 }
                  : horizontal ? { x: width / 2, y: 0 } : { x: 0, y: height / 2 };
              const forward = (to.x - from.x) * offset.x + (to.y - from.y) * offset.y >= 0;
              const entry = { x: mount.x + offset.x * (forward ? -1 : 1), y: mount.y + offset.y * (forward ? -1 : 1) };
              const exit = { x: mount.x + offset.x * (forward ? 1 : -1), y: mount.y + offset.y * (forward ? 1 : -1) };
              return <g key={connection.id} data-world-connection={connection.id} data-open={connection.open}><polyline data-world-route points={`${from.x},${from.y} ${entry.x},${entry.y} ${exit.x},${exit.y} ${to.x},${to.y}`} fill="none" className={style} /></g>;
            })}{surfaces.filter(value => value.surface.locationId).map(value => <line key={value.surface.id} className="world-surface-anchor" x1={value.anchor.x} y1={value.anchor.y} x2={value.x} y2={value.y} />)}</svg>
            {surfaces.map(value => <ActivityProgramSurface key={value.surface.id} session={session} surface={value.surface} geometry={value.geometry} x={value.x} y={value.y} angle={value.angle} disabled={disabled} onAction={onAction} onOpen={openSurface} />)}
            {world.locations.map(value => {
              const target = targets?.targets.find(item => item.id === value.id);
              const group = groups.get(value.id)!;
              return <button key={value.id} ref={node => { if (node) locationButtons.current.set(value.id, node); else locationButtons.current.delete(value.id); }} type="button" className="world-location" data-world-location={value.id} data-inspected={value.inspected} data-move-target={target?.allowed ?? false} data-selected={selection === value.id} aria-label={`Visit ${value.label}`} style={{ left: `${group.x}px`, top: `${group.y}px` }} onClick={() => void useLocation(value.id)} onDragOver={event => { if (!disabled) event.preventDefault(); }} onDrop={event => dropAt(event, value.id)}>
                <span className="world-location-ground" aria-hidden="true"><MapPin size={20} /></span><strong>{value.label}</strong>{group.all.length > 3 ? <small>{group.all.length} here</small> : value.accepts === "device" && value.capacity <= 3 ? <small>{value.capacity} {value.capacity === 1 ? "spot" : "spots"}</small> : null}
              </button>;
            })}
            {world.entities.map(value => {
              const at = locations.get(value.locationId); if (!at) return null;
              const group = groups.get(value.locationId)!;
              const index = group.visible.findIndex(item => item.id === value.id);
              if (index < 0) return null;
              const offset = (index - (group.visible.length - 1) / 2) * group.spacing;
              const hasRepresentation = Boolean(value.representationObjectId);
              return <button key={value.id} ref={node => { if (node) entityButtons.current.set(value.id, node); else entityButtons.current.delete(value.id); }} type="button" className={`world-entity world-entity-${value.kind}`} data-world-entity={value.id} data-current-location={value.locationId} data-status={value.currentStatus} data-selected={selection === value.id} aria-label={`Explore ${value.label}`} style={{ left: `${group.x + offset}px`, top: `${group.y}px` }} title={value.reactionText || value.label} onClick={() => chooseEntity(value)} draggable={!disabled && value.actionIds.some(id => session.actions.some(action => action.id === id && ["move_actor", "place_piece"].includes(action.operation)))} onDragStart={event => { event.dataTransfer.setData(DRAG_TYPE, value.id); chooseEntity(value); }}>
                <span className="world-entity-illustration"><Asset name={value.asset} size={hasRepresentation ? 21 : 30} />{hasRepresentation ? <Representation session={session} objectId={value.representationObjectId} /> : null}</span><span className="world-entity-label">{value.label}</span>{value.currentStatus === "complete" ? <span className="world-entity-done" aria-label="Complete"><Flag size={12} /></span> : null}
              </button>;
            })}
          </div>
        </div>
        <div className="world-route-status" aria-label="Connections">{world.connections.map(value => <span key={value.id} data-connection-status={value.id} data-open={value.open}><span aria-hidden="true" />{value.open ? value.label : value.blockedLabel}</span>)}</div>
        {world.reactions.length ? <div className="world-reactions" aria-label="World reactions" aria-live="polite">{world.reactions.map(value => <p key={value.id} data-world-reaction={value.id} data-status={value.status}><Sparkles size={16} aria-hidden="true" />{value.text}</p>)}</div> : null}
        {session.status === "completed" ? <section className="world-completion" role="status" aria-labelledby="world-complete-title"><Flag size={25} aria-hidden="true" /><div><h2 id="world-complete-title">Mission complete</h2><p>{completeReaction || session.completionFeedback || "Your finished world is saved."}</p><span>{session.outcome.evidence.some(value => value.status === "pending_parent_review") ? "Pending parent review · Your creation has not been scored for quality." : session.outcome.assisted ? "Finished with help · Your assistance is saved." : "Your activity evidence is saved."}</span></div></section> : null}
      </div>
      <aside ref={contextPanel} className={`world-context ${selection ? "world-context-selected" : ""}`} aria-label="Selected world object">
        {selection ? <>
          <header className="world-context-heading"><div><span className="account-eyebrow">TAKE A CLOSER LOOK</span><h2>{entity?.label || location?.label || "Your world"}</h2></div><button type="button" className="world-close-context" aria-label="Close object tools" onClick={closeContext}><X size={18} /></button></header>
          {entity?.reactionText ? <p className="world-context-reaction" role="status">{entity.reactionText}</p> : null}
          {entity?.representationObjectId ? <div className="world-artifact-preview"><Representation session={session} objectId={entity.representationObjectId} /></div> : null}
          {selectedActions.length ? <div className="world-context-actions">{selectedActions.map(value => <button key={value.id} className="button secondary" data-world-action={value.id} disabled={disabled} aria-pressed={armedAction === value.id} onClick={() => armWorldAction(value)}><MoveRight size={17} aria-hidden="true" />{value.label}</button>)}</div> : null}
          {location && inspection.length ? <div className="world-context-actions">{inspection.map(value => {
            const allowed = world.actionTargets.find(item => item.actionId === value.id)?.targets.some(item => item.id === location.id && item.allowed);
            return <button key={value.id} className="button secondary" data-world-action={value.id} disabled={disabled || !allowed} onClick={() => void useLocation(location.id, value)}><Search size={17} aria-hidden="true" />{value.label}</button>;
          })}</div> : null}
          {location ? <div className="world-location-contents" aria-label={`${location.label} contents`}>{world.entities.filter(value => value.locationId === location.id).map(value => <button key={value.id} type="button" data-world-inventory-entity={value.id} onClick={() => chooseEntity(value)}><Asset name={value.asset} size={22} />{value.label}</button>)}</div> : null}
          {tools.length ? <div className="world-tool-tabs" role="group" aria-label="Object tools">{tools.map(value => <button key={value.componentId} type="button" disabled={!value.available} aria-pressed={selectedTool?.componentId === value.componentId} onClick={() => setActiveTool(value.componentId)}>{value.label}{!value.available ? " · Not available yet" : ""}</button>)}</div> : null}
          {tool ? <div className="world-context-tool" data-program-component={tool.id}><ActivityProgramControl session={session} component={tool} disabled={disabled} onAction={onAction} /></div> : !tools.length && !selectedActions.length && !location ? <p className="program-control-note">Look around the world to discover what you can change.</p> : null}
          {tool ? <button type="button" className="button secondary world-back-button" onClick={closeContext}><MapPin size={17} aria-hidden="true" />Back to the world</button> : null}
        </> : <div className="world-context-empty"><Box size={38} aria-hidden="true" /><h2>Your world is ready.</h2><p>Choose an object to work with it. Your construction changes what happens here.</p></div>}
      </aside>
    </div>
  </section>;
}
