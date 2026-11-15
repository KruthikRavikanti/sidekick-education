"use client";

import { Minus, Plus, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { ActivityResponse, ActivityScene } from "@/lib/activity-types";

type AreaScene = Extract<ActivityScene, { component: "math_workspace" }>;
type Point = { x: number; y: number };
interface AreaProps {
  scene: AreaScene;
  disabled: boolean;
  initialResponse?: ActivityResponse | null;
  onResponse: (response: ActivityResponse, ready: boolean) => void;
}

/** One board has three actions: cover a rectangle, design one, or express its area. */
export function AreaWorkspace({ scene, disabled, initialResponse, onResponse }: AreaProps) {
  const { area, mode, unitLabel } = scene.params;
  const saved = initialResponse && typeof initialResponse === "object" && "marks" in initialResponse ? initialResponse : null;
  const [marks, setMarks] = useState<Point[]>(saved?.marks ?? []);
  const [text, setText] = useState(saved?.text ?? "");
  // The server resolves a connected board from the accepted earlier scene before
  // returning currentScene. The browser never invents or fetches an answer key.
  const [rows, setRows] = useState(mode === "area_design" ? saved?.marks[0]?.y ?? area?.rows ?? 1 : area?.rows ?? 1);
  const [columns, setColumns] = useState(mode === "area_design" ? saved?.marks[0]?.x ?? area?.columns ?? 1 : area?.columns ?? 1);
  if (!area || (mode === "area_design" && typeof area.targetArea !== "number")) return <p role="alert">This board is missing its materials. Please reopen the activity.</p>;
  const guided = scene.phase === "guided";
  const tile = mode === "area_tile";
  const design = mode === "area_design";
  const used = rows * columns;

  function toggleCell(point: Point) {
    const exists = marks.some(mark => mark.x === point.x && mark.y === point.y);
    const next = exists ? marks.filter(mark => mark.x !== point.x || mark.y !== point.y) : [...marks, point];
    setMarks(next);
    onResponse({ marks: next, text: "" }, next.length > 0);
  }

  function resize(nextRows: number, nextColumns: number) {
    setRows(nextRows);
    setColumns(nextColumns);
    const next = [{ x: nextColumns, y: nextRows }];
    setMarks(next);
    onResponse({ marks: next, text: "" }, nextRows !== area!.rows || nextColumns !== area!.columns);
  }

  function reset() {
    setMarks([]);
    setText("");
    setRows(area!.rows);
    setColumns(area!.columns);
    onResponse({ marks: [], text: "" }, false);
  }

  return <section className="activity-family area-workspace" aria-label="Rectangle area workspace" data-mode={mode} data-rows={rows} data-columns={columns} data-tiles-placed={tile ? marks.length : used}>
    <p className="activity-toolkit-goal">{scene.params.goal}</p>
    <p className="family-note">{tile ? "Place one tile in each square. Tap a tile to lift it again." : design ? "Change the rows and columns to reshape your rectangle." : "Write an expression for the rectangle."}</p>
    {design ? <fieldset className="area-dimensions" disabled={disabled}>
      <legend>Shape your rectangle</legend>
      <Dimension label="Rows" value={rows} max={Math.min(12, scene.params.height, Math.floor(120 / columns))} disabled={disabled} onChange={next => resize(next, columns)} />
      <Dimension label="Columns" value={columns} max={Math.min(12, scene.params.width, Math.floor(120 / rows))} disabled={disabled} onChange={next => resize(rows, next)} />
    </fieldset> : null}
    <figure className="area-board-figure" aria-label={design ? "Your rectangle design" : tile ? "Rectangle to tile" : "Your connected rectangle"}>
      <figcaption>{columns} {columns === 1 ? "column" : "columns"}</figcaption>
      <div className="area-board-with-label">
        <span className="area-row-label">{rows} {rows === 1 ? "row" : "rows"}</span>
        <div className="area-cell-grid" role={tile ? "group" : "img"} aria-label={tile ? "Unit-square spaces" : `${rows} rows of ${columns} unit squares`} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, width: columns * 44, minWidth: columns * 28, aspectRatio: `${columns} / ${rows}` }}>
          {Array.from({ length: used }, (_, index) => {
            const x = index % columns, y = Math.floor(index / columns);
            const selected = marks.some(mark => mark.x === x && mark.y === y);
            return tile ? <button type="button" key={`${x}-${y}`} className={`area-cell${selected ? " area-cell-filled" : ""}`} disabled={disabled} aria-label={`${selected ? "Lift" : "Place"} tile at row ${y + 1}, column ${x + 1}`} aria-pressed={selected} onClick={() => toggleCell({ x, y })}><span aria-hidden="true">{selected ? "◆" : "+"}</span></button> : <span key={`${x}-${y}`} className="area-cell area-cell-filled" aria-hidden="true" />;
          })}
        </div>
      </div>
      <p className="family-note">Each square is 1 square {unitLabel}.</p>
    </figure>
    {tile && guided ? <output className="area-live-state" aria-label="Tiles placed" aria-live="polite">{marks.length} {marks.length === 1 ? "tile" : "tiles"} placed</output> : null}
    {design && typeof area.targetArea === "number" ? guided ? <output className="area-live-state" aria-label="Tile stock" aria-live="polite">{used} tiles used · {area.targetArea - used >= 0 ? `${area.targetArea - used} in stock` : `${used - area.targetArea} more than the stock`}</output> : <p className="family-note" aria-label="Available tile stock">Available: {area.targetArea} tiles.</p> : null}
    {!tile && !design ? <>
      <label className="family-field-label" htmlFor={`area-expression-${scene.id}`}>Your area expression</label>
      <input id={`area-expression-${scene.id}`} className="area-expression-input" type="text" maxLength={200} autoCapitalize="off" autoCorrect="off" spellCheck={false} disabled={disabled} value={text} onChange={event => {
        const next = event.target.value;
        setText(next);
        onResponse({ marks: [], text: next }, Boolean(next.trim()));
      }} />
    </> : null}
    {tile || design ? <button type="button" className="family-secondary" disabled={disabled || (tile ? !marks.length : !marks.length && rows === area.rows && columns === area.columns)} onClick={reset}><RotateCcw size={16} aria-hidden="true" />{tile ? "Lift all tiles" : "Reset rectangle"}</button> : null}
  </section>;
}

function Dimension({ label, value, max, disabled, onChange }: { label: string; value: number; max: number; disabled: boolean; onChange: (value: number) => void }) {
  return <div className="area-dimension">
    <span>{label}</span>
    <div className="area-dimension-actions">
      <button type="button" className="family-secondary" aria-label={`Remove one ${label === "Rows" ? "row" : "column"}`} disabled={disabled || value <= 1} onClick={() => onChange(value - 1)}><Minus size={17} aria-hidden="true" /></button>
      <output aria-label={label} aria-live="polite">{value}</output>
      <button type="button" className="family-secondary" aria-label={`Add one ${label === "Rows" ? "row" : "column"}`} disabled={disabled || value >= max} onClick={() => onChange(value + 1)}><Plus size={17} aria-hidden="true" /></button>
    </div>
  </div>;
}
