"use client";

import { ArrowLeftRight, Check, Layers, Move, Plus, Scissors } from "lucide-react";
import { useState, type CSSProperties, type DragEvent, type KeyboardEvent } from "react";
import type { ProgramAction, ProgramComponent, ProgramFractionView, ProgramInputs, ProgramSession } from "@/lib/activity-program-types";

interface FractionProps {
  session: ProgramSession;
  component: ProgramComponent;
  disabled: boolean;
  onAction: (action: ProgramAction, inputs: ProgramInputs) => Promise<boolean>;
}

type PieceTool = "build" | "move";
const DRAG_TYPE = "application/x-sidekick-fraction-piece";

function Whole({ view, height, disabled, mode, movingPiece, onPiece, onMove, onSelect }: {
  view: ProgramFractionView;
  height: number;
  disabled: boolean;
  mode: PieceTool;
  movingPiece: string | null;
  onPiece: (piece: string) => void;
  onMove: (from: string, to: string) => void;
  onSelect: (piece: string | null) => void;
}) {
  const rows = view.denominator / view.width;
  const shaded = new Set(view.pieces);
  const interactive = view.editable;
  const label = interactive ? "Your window" : "Target window";
  function moveWithKey(event: KeyboardEvent<HTMLButtonElement>, piece: string, index: number) {
    if (disabled || !shaded.has(piece)) return;
    const row = index % rows;
    const column = Math.floor(index / rows);
    const next = event.key === "ArrowLeft" && column > 0 ? index - rows
      : event.key === "ArrowRight" && column + 1 < view.width ? index + rows
      : event.key === "ArrowUp" && row > 0 ? index - 1
      : event.key === "ArrowDown" && row + 1 < rows ? index + 1 : null;
    if (next !== null) {
      event.preventDefault();
      onMove(piece, `p${next}`);
    }
  }
  function beginDrag(event: DragEvent<HTMLButtonElement>, piece: string) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(DRAG_TYPE, JSON.stringify({ objectId: view.objectId, piece }));
    onSelect(piece);
  }
  function drop(event: DragEvent<HTMLButtonElement>, destination: string) {
    event.preventDefault();
    if (disabled || shaded.has(destination)) return;
    try {
      const source = JSON.parse(event.dataTransfer.getData(DRAG_TYPE)) as { objectId?: string; piece?: string };
      if (source.objectId === view.objectId && typeof source.piece === "string" && shaded.has(source.piece)) onMove(source.piece, destination);
    } catch { /* Only this workspace's plain piece reference can be moved. */ }
  }
  return <figure className="program-fraction-figure" aria-label={label} data-fraction-object={view.objectId} data-fraction-editable={view.editable} data-numerator={view.numerator} data-denominator={view.denominator}>
    <figcaption><span>{label}</span><strong aria-label={`${label} fraction`}>{view.numerator}<span aria-hidden="true">/</span><span className="visually-hidden"> out of </span>{view.denominator}</strong></figcaption>
    <div key={view.denominator} className={`program-fraction-whole ${interactive ? "program-fraction-working" : "program-fraction-target"}`} style={{ "--fraction-columns": view.width, "--fraction-rows": rows, "--fraction-height": `${height}px` } as CSSProperties} data-fraction-whole={view.objectId} data-fraction-grid={view.objectId} data-shaded-count={view.numerator}>
      {Array.from({ length: view.denominator }, (_, index) => {
        const piece = `p${index}`;
        const selected = shaded.has(piece);
        const className = `program-fraction-piece ${selected ? "program-fraction-piece-shaded" : ""} ${movingPiece === piece && interactive ? "program-fraction-piece-moving" : ""}`;
        if (!interactive) return <span key={piece} className={className} data-fraction-piece={piece} data-fraction-shaded={selected} aria-hidden="true"><span>1/{view.denominator}</span></span>;
        const name = mode === "move" ? selected ? `Select piece ${index + 1} to move` : `Place piece ${index + 1} here` : `${selected ? "Lift" : "Place"} piece ${index + 1}`;
        return <button key={piece} type="button" className={className} data-fraction-piece={piece} data-fraction-shaded={selected} aria-label={name} aria-pressed={selected} disabled={disabled} onClick={() => onPiece(piece)} onKeyDown={event => moveWithKey(event, piece, index)} draggable={!disabled && selected} onDragStart={event => beginDrag(event, piece)} onDragEnd={() => onSelect(null)} onDragOver={event => { if (!disabled && !selected) event.preventDefault(); }} onDrop={event => drop(event, piece)}>
          <span className="program-fraction-piece-icon" aria-hidden="true">{selected ? <Check size={18} /> : <Plus size={16} />}</span><span>1/{view.denominator}</span>
        </button>;
      })}
    </div>
  </figure>;
}

/** Renders server-derived fraction views and submits bounded declared actions.
 * Goal, comparison and exact repartition decisions remain in ExecutionCore. */
export function ActivityProgramFractions({ session, component, disabled, onAction }: FractionProps) {
  const views = session.fractionViews?.filter(view => component.objectIds.includes(view.objectId)) || [];
  const working = views.find(view => view.editable);
  const target = views.find(view => !view.editable);
  const actions = session.actions.filter(action => action.componentId === component.id);
  const partition = actions.find(action => action.operation === "set_fraction_partition");
  const toggle = actions.find(action => action.operation === "toggle_fraction_piece");
  const move = actions.find(action => action.operation === "move_fraction_piece");
  const [mode, setMode] = useState<PieceTool>("build");
  const [moving, setMoving] = useState<string | null>(null);
  const [comparing, setComparing] = useState(false);
  const [notice, setNotice] = useState("");
  if (!working || !target || !toggle || !partition || !move || working.width !== target.width || working.wholeId !== target.wholeId
      || working.denominator % working.width !== 0 || target.denominator % target.width !== 0) {
    return <p className="account-error" role="alert">This fraction workspace needs a supported whole and piece controls.</p>;
  }
  const comparison = session.fractionComparisons?.find(value =>
    (value.leftObject === target.objectId && value.rightObject === working.objectId)
    || (value.rightObject === target.objectId && value.leftObject === working.objectId));
  const workingComparedToTarget = comparison?.comparison === "equal" ? "equal" : comparison?.comparison
    ? comparison.leftObject === working.objectId ? comparison.comparison : comparison.comparison === "less" ? "greater" : "less" : null;
  const comparisonSign = comparison?.equalAmount ? "=" : workingComparedToTarget === "less" ? ">" : workingComparedToTarget === "greater" ? "<" : "≠";
  const comparisonWords = comparison?.equalAmount ? " equals " : workingComparedToTarget === "less" ? " is greater than " : workingComparedToTarget === "greater" ? " is less than " : " is different from ";
  const comparisonFeedback = comparison?.equalAmount ? "The shaded amounts match." : workingComparedToTarget === "less" ? "Your window has less shaded area." : workingComparedToTarget === "greater" ? "Your window has more shaded area." : "Different shaded amounts. Keep building.";
  const equalSplitFactor = comparison?.equalAmount && working.denominator > target.denominator
    && working.denominator % target.denominator === 0 ? working.denominator / target.denominator : null;
  const input = partition.inputs.find(value => value.id === "denominator");
  const minimum = Math.max(2, input?.minimum ?? working.width);
  const maximum = Math.min(24, input?.maximum ?? working.denominator);
  const partitions = Array.from({ length: Math.max(0, maximum - minimum + 1) }, (_, index) => index + minimum).filter(value => value % working.width === 0);
  const allowed = working.allowedDenominators ? new Set(working.allowedDenominators) : null;
  const incompatible = allowed !== null && partitions.some(value => value !== working.denominator && !allowed.has(value));
  const denominatorRef = session.objects.find(object => object.id === working.objectId)?.bindings.denominator;
  const denominatorMaximum = session.stateSlots.find(slot => slot.id === denominatorRef)?.maximum ?? maximum;
  // Fix the physical whole for the complete declared domain, including its
  // frame, so every reachable partition retains the same area and touch size.
  const maximumRows = Math.floor(Math.max(maximum, denominatorMaximum, target.denominator, working.denominator) / working.width);
  const height = Math.max(180, maximumRows * 44 + 6);
  const activeMoving = moving && working.pieces.includes(moving) ? moving : null;

  async function movePiece(from: string, to: string) {
    if (disabled) return;
    if (from === to) { setMoving(null); return; }
    if (working!.pieces.includes(to)) { setNotice("Choose a clear space for this piece."); return; }
    if (await onAction(move!, { from, to })) { setMoving(null); setNotice("The piece moved. Its amount stayed the same."); }
  }
  async function actOnPiece(piece: string) {
    if (disabled) return;
    if (mode === "move") {
      if (working!.pieces.includes(piece)) { setMoving(activeMoving === piece ? null : piece); setNotice("Now choose a clear space."); }
      else if (activeMoving) await movePiece(activeMoving, piece);
      else setNotice("Choose a shaded piece first, then a clear space.");
    } else if (await onAction(toggle!, { piece })) { setMoving(null); setNotice(""); }
  }
  async function repartition(denominator: number) {
    if (await onAction(partition!, { denominator })) { setMoving(null); setNotice("New equal parts. The shaded amount stayed the same."); }
  }
  return <section className="program-fraction-workspace" aria-label="Fraction workspace" data-fraction-working-object={working.objectId}>
    <div className="program-fraction-tools" role="group" aria-label="Piece tool">
      <button type="button" aria-pressed={mode === "build"} disabled={disabled} onClick={() => { setMode("build"); setMoving(null); setNotice(""); }}><Layers size={17} aria-hidden="true" />Build pieces</button>
      <button type="button" aria-pressed={mode === "move"} disabled={disabled} onClick={() => { setMode("move"); setMoving(null); setNotice(""); }}><Move size={17} aria-hidden="true" />Move pieces</button>
      <button type="button" className="program-fraction-compare" aria-pressed={comparing} onClick={() => setComparing(value => !value)}><ArrowLeftRight size={17} aria-hidden="true" />Compare the windows</button>
    </div>
    <p className="program-fraction-instruction" aria-live="polite">{notice || (mode === "move" ? "Tap a shaded piece, then a clear space. You can also drag or use the arrow keys." : "Tap pieces in your window to place or lift them.")}</p>
    <div className="program-fraction-scroll"><div className="program-fraction-figures" style={{ "--fraction-min-width": `${working.width * 44 + 12}px` } as CSSProperties}>
      <Whole view={target} height={height} disabled mode={mode} movingPiece={null} onPiece={() => {}} onMove={() => {}} onSelect={() => {}} />
      <Whole view={working} height={height} disabled={disabled} mode={mode} movingPiece={activeMoving} onPiece={piece => void actOnPiece(piece)} onMove={(from, to) => void movePiece(from, to)} onSelect={setMoving} />
    </div></div>
    {comparing ? <section className="program-fraction-coverage" aria-label="Compare covered amounts"><h3>Covered area, lined up</h3><p>Position can change. Compare how much of each whole is shaded.</p>{[target, working].map(view => <div className="program-fraction-coverage-row" key={view.objectId}><span>{view.editable ? "Yours" : "Target"}<strong>{view.numerator}/{view.denominator}</strong></span><div className="program-fraction-coverage-bar" aria-label={`${view.editable ? "Your" : "Target"} covered amount`} data-coverage-object={view.objectId}><span style={{ width: `${100 * view.numerator / view.denominator}%` }} /></div></div>)}</section> : null}
    <fieldset className="program-fraction-partitions" disabled={disabled}>
      <legend><Scissors size={18} aria-hidden="true" />Equal parts in your whole</legend>
      <div>{partitions.map(value => <button key={value} type="button" aria-label={`Make ${value} equal parts`} aria-pressed={value === working.denominator} disabled={value === working.denominator || (allowed !== null && !allowed.has(value))} title={value !== working.denominator && allowed !== null && !allowed.has(value) ? "This partition is not available for the current construction." : undefined} onClick={() => void repartition(value)}><strong>{value}</strong><span>parts</span>{value > working.denominator && value % working.denominator === 0 ? <small>×{value / working.denominator}</small> : null}</button>)}</div>
      {incompatible ? <p>Some partitions are not available for this construction.</p> : null}
    </fieldset>
    {comparison ? <output className={`program-fraction-feedback ${comparison.equalAmount ? "program-fraction-feedback-match" : ""}`} aria-label="Fraction comparison" aria-live="polite" data-equal-amount={comparison.equalAmount}>
      <strong>{target.numerator}/{target.denominator} <span aria-hidden="true">{comparisonSign}</span><span className="visually-hidden">{comparisonWords}</span> {working.numerator}/{working.denominator}</strong>
      <span>{comparisonFeedback}</span>
    </output> : null}
    {equalSplitFactor !== null ? <aside className="program-fraction-counts" aria-label="How the equal parts changed">
      <p>Each target part is {equalSplitFactor} equal pieces.</p>
      <div><span aria-label={`Shaded pieces: ${target.numerator} times ${equalSplitFactor} equals ${working.numerator}`}>{target.numerator} × {equalSplitFactor} = {working.numerator}</span><span aria-label={`Total pieces: ${target.denominator} times ${equalSplitFactor} equals ${working.denominator}`}>{target.denominator} × {equalSplitFactor} = {working.denominator}</span></div>
    </aside> : null}
  </section>;
}
