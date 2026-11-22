"use client";

import { Check, Maximize2, Plus } from "lucide-react";
import type { CSSProperties } from "react";
import type { ProgramAction, ProgramInputs, ProgramSession, ProgramStageConstruction, ProgramStageSurface } from "@/lib/activity-program-types";

export interface SurfaceGeometry {
  width: number;
  height: number;
  columns: number;
  rows: number;
  direct: boolean;
  construction?: ProgramStageConstruction;
  constructionAnchor?: { x: number; y: number; left: number; right: number; top: number; bottom: number };
}

/** Sizing is presentation only; piece identity, selection and permitted gestures
 * come from the server's resolved surface. Every fraction retains its whole. */
export function surfaceGeometry(session: ProgramSession, surface: ProgramStageSurface, pathLength?: number): SurfaceGeometry {
  const object = session.objects.find(value => value.id === surface.objectId);
  const number = (role: string) => {
    const value = object && session.state[object.bindings[role]];
    return typeof value === "number" ? value : 1;
  };
  if (surface.kind === "fraction_strip") {
    const fraction = session.fractionViews?.find(value => value.objectId === surface.objectId);
    const columns = fraction?.width || object?.width || 1;
    const rows = (fraction?.denominator || number("denominator")) / columns;
    return { width: 164, height: 112, columns, rows, direct: 164 / columns >= 24 && 112 / rows >= 24 };
  }
  if (surface.kind === "grid") {
    const construction = session.stageView?.connections.find(value => value.id === surface.connectionId)?.construction;
    if (construction?.objectId === surface.objectId) {
      // One fixed unit scale covers the declared source bounds and target. A
      // reshape changes the occupied footprint, never the size of a unit tile.
      // Hidden source bounds are not read: only the public target is rendered.
      const bound = (role: string, actual: number | null, target: number) => {
        const slot = object && session.stateSlots.find(value => value.id === object.bindings[role]);
        return Math.max(target, actual || 0, construction.sourceVisible ? slot?.maximum || 0 : 0);
      };
      const scaleColumns = bound("columns", construction.actualColumns, construction.columns);
      const scaleRows = bound("rows", construction.actualRows, construction.rows);
      const unit = Math.min(44, 224 / scaleColumns, 176 / scaleRows);
      const columns = Math.max(construction.columns, construction.actualColumns || 0);
      const rows = Math.max(construction.rows, construction.actualRows || 0);
      const width = columns * unit;
      const height = rows * unit;
      const x = construction.columns * unit / 2;
      const y = construction.rows * unit / 2;
      return { width, height, columns, rows, direct: unit >= 24, construction,
        constructionAnchor: { x, y, left: Math.max(x, 112), right: Math.max(width - x, 112), top: y + 40, bottom: height - y + 64 } };
    }
    const count = surface.cells.length;
    const columns = surface.layout === "row" ? count : surface.layout === "column" ? 1 : number("columns");
    const rows = surface.layout === "column" ? count : surface.layout === "row" ? 1 : number("rows");
    const available = pathLength === undefined ? 180 : Math.max(48, pathLength - 54);
    const size = Math.min(44, available / Math.max(1, surface.layout === "column" ? rows : columns), 150 / Math.max(1, rows));
    return { width: Math.max(24, columns * size), height: Math.max(24, rows * size), columns, rows, direct: size >= 24 };
  }
  return { width: 166, height: 96, columns: 1, rows: 1, direct: false };
}

interface SurfaceProps {
  session: ProgramSession;
  surface: ProgramStageSurface;
  geometry: SurfaceGeometry;
  x: number;
  y: number;
  angle: number;
  disabled: boolean;
  onAction: (action: ProgramAction, inputs: ProgramInputs) => Promise<boolean>;
  onOpen: (surface: ProgramStageSurface) => void;
}

export function ActivityProgramSurface({ session, surface, geometry, x, y, angle, disabled, onAction, onOpen }: SurfaceProps) {
  const object = session.objects.find(value => value.id === surface.objectId);
  const action = session.actions.find(value => value.id === surface.actionId);
  const component = session.components.find(value => value.objectIds.includes(surface.objectId) && value.kind !== "world_stage");
  const fraction = session.fractionViews?.find(value => value.objectId === surface.objectId);
  const direct = Boolean(action && surface.inputId && geometry.direct);
  const selectedCount = surface.cells.filter(value => value.selected).length;
  const pieceGrid = surface.kind === "grid" || surface.kind === "fraction_strip";
  const construction = geometry.construction;
  const anchor = geometry.constructionAnchor;
  const angled = Boolean(pieceGrid && !construction && surface.connectionId && Math.abs(angle) > 0.1);
  const radians = angle * Math.PI / 180;
  const rotatedWidth = Math.abs(geometry.width * Math.cos(radians)) + Math.abs(geometry.height * Math.sin(radians));
  const rotatedHeight = Math.abs(geometry.width * Math.sin(radians)) + Math.abs(geometry.height * Math.cos(radians));
  const constructionMessage = !construction ? null : !construction.sourceVisible ? "Build a construction to fill this space."
    : !construction.dimensionsMatch ? `Your shape is ${construction.actualRows} × ${construction.actualColumns}. The space needs ${construction.rows} × ${construction.columns}.`
      : !construction.complete ? `Shape fits. Cover all ${construction.requiredCells} unit squares.`
        : `Fits: all ${construction.requiredCells} unit squares are covered.`;
  let content = "";
  if (object?.kind === "text_artifact") {
    const value = session.state[object.bindings.text];
    content = typeof value === "string" ? value : "";
  } else if (object?.kind === "evidence_board") {
    const choice = session.state[object.bindings.selection];
    content = session.materials.filter(value => object.materialIds.includes(value.id)).flatMap(value => value.items).find(value => value.id === choice)?.text || "";
  } else if (object?.kind === "equation") {
    content = `${session.state[object.bindings.left]} × ${session.state[object.bindings.right]} = ${session.state[object.bindings.result]}`;
  }
  const caption = <div className="world-surface-caption">{fraction ? <strong>{fraction.numerator}/{fraction.denominator}</strong> : pieceGrid && (!construction || construction.sourceVisible) ? <span>{selectedCount}/{surface.cells.length} placed</span> : null}{component ? <button type="button" aria-label={`Open ${surface.label} tools`} onClick={() => onOpen(surface)}><Maximize2 size={13} aria-hidden="true" /><span>Tools</span></button> : null}</div>;

  return <section className={`world-surface world-surface-kind-${surface.kind} ${surface.connectionId ? "world-path-surface" : "world-location-surface"} ${construction ? "world-construction-surface" : ""} ${angled ? "world-angled-surface" : ""}`} aria-label={surface.label} data-world-surface={surface.id} data-source-object={surface.objectId} data-surface-action={surface.actionId || ""} data-construction-fits={construction?.fits ?? undefined} style={{ left: `${x}px`, top: `${y}px`, "--surface-angle": `${angle}deg`, "--surface-label-angle": `${-angle}deg`, "--surface-width": `${geometry.width}px`, "--surface-height": `${geometry.height}px`, "--surface-rotated-width": `${rotatedWidth}px`, "--surface-rotated-height": `${rotatedHeight}px`, "--construction-anchor-x": `${anchor?.x || 0}px`, "--construction-anchor-y": `${anchor?.y || 0}px` } as CSSProperties}>
    {construction ? <header className="world-construction-heading"><h3 className="world-surface-label">{surface.label}</h3><p className="world-construction-legend"><span aria-hidden="true" />{construction.rows} × {construction.columns} space</p></header> : <h3 className="world-surface-label">{surface.label}</h3>}
    {pieceGrid ? <div className={`world-surface-grid ${surface.kind === "fraction_strip" ? "world-surface-whole" : ""} ${construction ? "world-construction-grid" : ""}`} role="group" aria-label={`${surface.label} pieces`} data-surface-grid style={{ width: `${geometry.width}px`, height: `${geometry.height}px`, gridTemplateColumns: `repeat(${geometry.columns}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${geometry.rows}, minmax(0, 1fr))` }}>
      {surface.cells.map((cell, index) => {
        const source = /^r(\d+)c(\d+)$/.exec(cell.id);
        const sourceRow = source ? Number(source[1]) : index % geometry.rows;
        const sourceColumn = source ? Number(source[2]) : Math.floor(index / geometry.rows);
        const position = surface.kind === "fraction_strip" ? { gridRow: sourceRow + 1, gridColumn: sourceColumn + 1 }
          : construction || surface.layout === "object" ? { gridRow: sourceRow + 1, gridColumn: sourceColumn + 1 } : undefined;
        const attributes = { "data-surface-cell": cell.id, "data-selected": cell.selected, "data-source-row": sourceRow, "data-source-column": sourceColumn };
        const name = `${cell.selected ? "Lift" : "Place"} ${surface.label} ${source ? `at row ${sourceRow + 1}, column ${sourceColumn + 1}` : `piece ${index + 1}`}`;
        if (!direct) return <span className="world-surface-cell" key={cell.id} {...attributes} style={position} aria-hidden="true" />;
        return <button type="button" key={cell.id} className="world-surface-cell" {...attributes} style={position} aria-label={name} aria-pressed={cell.selected} disabled={disabled || !cell.allowed} title={!cell.allowed ? "This piece is not available for the current construction." : undefined} onClick={() => void onAction(action!, { [surface.inputId!]: cell.id })}>{cell.selected ? <Check size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}</button>;
      })}
      {construction ? Array.from({ length: construction.rows }, (_, row) => Array.from({ length: construction.columns }, (_, column) => <span key={`target-${row}-${column}`} className="world-construction-target" data-target-cell={`r${row}c${column}`} data-target-row={row} data-target-column={column} style={{ gridRow: row + 1, gridColumn: column + 1 }} aria-hidden="true" />)) : null}
    </div> : <p className="world-surface-text" data-world-surface-content title={content}>{content || "Your construction appears here."}</p>}
    {construction ? <div className="world-construction-footer"><p className="world-construction-feedback" data-construction-feedback aria-live="polite">{constructionMessage}</p>{caption}</div> : caption}
  </section>;
}
