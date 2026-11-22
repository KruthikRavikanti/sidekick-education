"use client";

import { Check, Pencil, Plus } from "lucide-react";
import { useState, type CSSProperties } from "react";
import type { ProgramAction, ProgramComponent, ProgramInputs, ProgramMaterial, ProgramObject, ProgramSession } from "@/lib/activity-program-types";

type ControlProps = {
  session: ProgramSession;
  component: ProgramComponent;
  disabled: boolean;
  onAction: (action: ProgramAction, inputs: ProgramInputs) => Promise<boolean>;
};

function materialFor(session: ProgramSession, objects: ProgramObject[]) {
  const ids = new Set(objects.flatMap((object) => object.materialIds));
  return session.materials.filter((material) => ids.has(material.id));
}
function ProgramMaterials({ materials }: { materials: ProgramMaterial[] }) {
  return <>{materials.map((material) => {
    const identity = { "data-program-material": material.id, "data-material-kind": material.kind };
    switch (material.kind) {
      case "prompt":
        return <p key={material.id} className="program-prompt" {...identity}>{material.text}</p>;
      case "passage":
        return <blockquote key={material.id} className="program-passage" aria-label="Reading passage" {...identity}><p>{material.text}</p></blockquote>;
      case "unit_tiles":
        return <p key={material.id} className="program-control-note" aria-label="Tile stock" {...identity}>{material.quantity === null ? "Tile stock unavailable." : `${material.quantity} unit-square tiles in your stock.`}</p>;
      case "words":
        return <section key={material.id} className="program-passage" aria-label="Word pieces" {...identity}>{material.text ? <p>{material.text}</p> : null}<ul>{material.items.map(item => <li key={item.id}>{item.text}</li>)}</ul></section>;
    }
  })}</>;
}
function numeric(session: ProgramSession, object: ProgramObject, role: string) {
  const value = session.state[object.bindings[role]];
  return typeof value === "number" ? value : 0;
}

function UnitGrid({ session, object, action, disabled, onAction }: {
  session: ProgramSession; object: ProgramObject; action?: ProgramAction;
  disabled: boolean; onAction: ControlProps["onAction"];
}) {
  const rows = numeric(session, object, "rows");
  const columns = numeric(session, object, "columns");
  const value = session.state[object.bindings.cells];
  const cells = new Set(Array.isArray(value) ? value : []);
  const allowed = action?.inputs.find((input) => input.id === "cell")?.options || [];
  return <div className="program-board">
    <div className="program-board-dimensions"><span>{columns} columns</span><span>{rows} rows</span></div>
    <div className="program-board-scroll">
      <div className={`program-unit-grid ${action ? "program-grid-editable" : ""}`} role="region" aria-label="Unit-square workspace" data-rows={rows} data-columns={columns} data-tiles-placed={cells.size} style={{ "--program-columns": columns } as CSSProperties}>
        {Array.from({ length: rows }, (_, row) => Array.from({ length: columns }, (_, column) => {
          const cell = `r${row}c${column}`;
          const selected = cells.has(cell);
          if (!action) return <span key={cell} className="program-unit-square program-unit-solid" aria-hidden="true" />;
          return <button key={cell} className={`program-unit-square ${selected ? "program-unit-selected" : ""}`} type="button" aria-label={`${selected ? "Lift" : "Place"} tile at row ${row + 1}, column ${column + 1}`} aria-pressed={selected} disabled={disabled || !allowed.includes(cell)} onClick={() => void onAction(action, { cell })}>
            {selected ? <Check size={18} aria-hidden="true" /> : <Plus size={15} aria-hidden="true" />}
          </button>;
        }))}
      </div>
    </div>
    <p className="program-board-caption" aria-live="polite">{action ? `${cells.size} squares covered · ${rows * columns} spaces` : `${rows * columns} unit squares in your rectangle`}</p>
    {action && !disabled ? <p className="program-control-note">Tap a space to place a tile. Tap a tile to lift it. You can also use Tab and Space.</p> : null}
  </div>;
}

function NumberAction({ action, values, disabled, onAction }: {
  action: ProgramAction; values: Record<string, number>; disabled: boolean; onAction: ControlProps["onAction"];
}) {
  const [draft, setDraft] = useState<Record<string, string>>(() => Object.fromEntries(action.inputs.map((input) => [input.id, String(values[input.id] ?? "")])));
  const labels: Record<string, string> = { rows: "Rows", columns: "Columns", left: "First factor", right: "Second factor", result: "Product" };
  const product = action.operation === "assemble_product";
  return <form className={`program-number-tool ${product ? "program-product-tool" : ""}`} aria-label={product ? "Multiplication builder" : "Rectangle builder"} onSubmit={(event) => {
    event.preventDefault();
    const inputs = Object.fromEntries(action.inputs.map((input) => [input.id, Number(draft[input.id])]));
    if (action.inputs.every((input) => draft[input.id] !== "" && Number.isSafeInteger(inputs[input.id]))) void onAction(action, inputs);
  }}>
    <fieldset disabled={disabled}>
      <legend>{product ? "Build the expression for your construction" : "Shape your rectangle"}</legend>
      <div className="program-number-inputs">{action.inputs.map((input, index) => <div className="program-number-item" key={input.id}>
        {product && index > 0 ? <span className="program-expression-sign" aria-hidden="true">{index === 1 ? "×" : "="}</span> : null}
        <label htmlFor={`${action.id}-${input.id}`}>{labels[input.id] || input.id}
          <input id={`${action.id}-${input.id}`} type="number" inputMode="numeric" min={input.minimum ?? undefined} max={input.maximum ?? undefined} step={1} required value={draft[input.id] ?? ""} onChange={(event) => setDraft((previous) => ({ ...previous, [input.id]: event.target.value }))} />
        </label>
      </div>)}</div>
      <button className="button primary" type="submit">{action.label}</button>
    </fieldset>
  </form>;
}

function MathWorkspace({ session, component, disabled, onAction }: ControlProps) {
  const objects = session.objects.filter((object) => component.objectIds.includes(object.id));
  const actions = session.actions.filter((action) => action.componentId === component.id);
  const materials = materialFor(session, objects);
  const grid = objects.find((object) => object.kind === "grid");
  const equation = objects.find((object) => object.kind === "equation");
  const tileAction = actions.find((action) => action.operation === "toggle_tile");
  const numberActions = actions.filter((action) => ["resize_rectangle", "assemble_product"].includes(action.operation));
  const unsupported = actions.some((action) => !["toggle_tile", "resize_rectangle", "assemble_product"].includes(action.operation));
  if (unsupported) return <UnsupportedControl />;
  return <div className="program-math-workspace">
    <ProgramMaterials materials={materials} />
    {grid ? <UnitGrid session={session} object={grid} action={tileAction} disabled={disabled} onAction={onAction} /> : null}
    {numberActions.map((action) => {
      const object = action.operation === "resize_rectangle" ? grid : equation;
      if (!object) return <UnsupportedControl key={action.id} />;
      const values = Object.fromEntries(action.inputs.map((input) => [input.id, numeric(session, object, input.id)]));
      return <NumberAction key={`${action.id}:${JSON.stringify(values)}`} action={action} values={values} disabled={disabled} onAction={onAction} />;
    })}
    {equation ? <p className="program-saved-expression" aria-label="Saved multiplication expression">Your expression: <strong>{numeric(session, equation, "left")} × {numeric(session, equation, "right")} = {numeric(session, equation, "result")}</strong></p> : null}
  </div>;
}

function EvidenceWorkspace({ session, component, disabled, onAction }: ControlProps) {
  const objects = session.objects.filter((object) => component.objectIds.includes(object.id));
  const board = objects.find((object) => object.kind === "evidence_board");
  const action = session.actions.find((item) => item.componentId === component.id && item.operation === "select_evidence");
  if (!board || !action) return <UnsupportedControl />;
  const materials = materialFor(session, objects);
  const passages = materials.filter((material) => material.kind === "passage");
  const selection = session.state[board.bindings.selection];
  const options = new Set(action.inputs.find((input) => input.id === "sentence")?.options || []);
  const items = passages.flatMap((passage) => passage.items).filter((item) => options.has(item.id));
  const selected = items.find((item) => item.id === selection);
  return <div className="program-evidence-workspace">
    <ProgramMaterials materials={materials} />
    <fieldset className="program-evidence-options" disabled={disabled}>
      <legend>{action.label}</legend>
      {items.map((item) => <button key={item.id} type="button" className={`program-evidence-option ${item.id === selection ? "program-evidence-selected" : ""}`} aria-pressed={item.id === selection} onClick={() => void onAction(action, { sentence: item.id })}>{item.id === selection ? <Check size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}<span>{item.text}</span></button>)}
    </fieldset>
    <aside className={`program-clue-board ${selected ? "program-clue-filled" : ""}`} aria-label="Your clue board" aria-live="polite"><p className="account-eyebrow">YOUR CLUE BOARD</p><p>{selected?.text || "Choose a sentence to place it here."}</p></aside>
  </div>;
}

function DraftEditor({ savedText, action, disabled, onAction }: { savedText: string; action: ProgramAction; disabled: boolean; onAction: ControlProps["onAction"] }) {
  const [draft, setDraft] = useState(savedText);
  const input = action.inputs.find((item) => item.id === "text");
  return <form className="program-draft-editor" onSubmit={(event) => { event.preventDefault(); void onAction(action, { text: draft }); }}>
    <label htmlFor={`${action.id}-draft`}>{savedText ? "Revise your saved writing" : "Your writing"}</label>
    <textarea id={`${action.id}-draft`} value={draft} onChange={(event) => setDraft(event.target.value)} rows={10} minLength={input?.minLength ?? undefined} maxLength={input?.maxLength ?? undefined} disabled={disabled} required spellCheck />
    <div className="program-draft-footer"><span>{draft.length}{input?.maxLength ? ` / ${input.maxLength}` : ""} characters</span><button className="button primary" type="submit" disabled={disabled || !draft.trim() || (action.operation === "revise_text" && draft === savedText)}><Pencil size={17} aria-hidden="true" />{action.label}</button></div>
  </form>;
}

function TextWorkspace({ session, component, disabled, onAction }: ControlProps) {
  const objects = session.objects.filter((object) => component.objectIds.includes(object.id));
  const artifact = objects.find((object) => object.kind === "text_artifact");
  const saved = artifact ? session.state[artifact.bindings.text] : "";
  const savedText = typeof saved === "string" ? saved : "";
  const actions = session.actions.filter((action) => action.componentId === component.id);
  const action = actions.find((item) => item.operation === (savedText ? "revise_text" : "replace_text")) || actions.find((item) => ["replace_text", "revise_text"].includes(item.operation));
  if (!artifact || !action) return <UnsupportedControl />;
  return <div className="program-text-workspace">
    <ProgramMaterials materials={materialFor(session, objects)} />
    {savedText ? <p className="program-draft-saved" role="status"><Check size={16} aria-hidden="true" />Your draft is saved. {disabled ? "" : "Make a change to revise it."}</p> : null}
    <DraftEditor key={`${action.id}:${savedText}`} savedText={savedText} action={action} disabled={disabled} onAction={onAction} />
    <p className="program-control-note">Your words and revisions are saved privately. A parent can assess the writing; saving it does not grade its quality.</p>
  </div>;
}

function UnsupportedControl() {
  return <p className="account-error" role="alert">This workspace needs a control that is not available in this preview.</p>;
}

export function ActivityProgramControl(props: ControlProps) {
  switch (props.component.kind) {
    case "math_workspace": return <MathWorkspace {...props} />;
    case "evidence_board": return <EvidenceWorkspace {...props} />;
    case "text_editor": return <TextWorkspace {...props} />;
    default: return <UnsupportedControl />;
  }
}
