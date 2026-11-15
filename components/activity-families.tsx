"use client";

import { Minus, Plus, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { ActivityResponse, ActivityScene } from "@/lib/activity-types";
import { DrawingControl, OralControl } from "./activity-media-controls";

export type FamilyComponent = "quantity_lab" | "math_workspace" | "sort_connect" | "text_editor" | "oral_studio" | "drawing_studio";
type FamilyScene<C extends FamilyComponent> = Extract<ActivityScene, { component: C }>;
interface FamilyProps<C extends FamilyComponent> {
  scene: FamilyScene<C>;
  sessionId: string;
  disabled: boolean;
  initialResponse?: ActivityResponse | null;
  onResponse: (response: ActivityResponse, ready: boolean) => void;
}

function Mission({ children }: { children: string }) {
  return <p className="activity-toolkit-goal">{children}</p>;
}

function QuantityLab({ scene, disabled, initialResponse, onResponse }: FamilyProps<"quantity_lab">) {
  const { stock, containers, initialCounts, unitValue, taskOperation } = scene.params;
  const [counts, setCounts] = useState(() => containers.map((container, index) =>
    initialResponse && typeof initialResponse === "object" && "allocations" in initialResponse
      ? initialResponse.allocations.find(item => item.containerId === container.id)?.count ?? initialCounts[index]
      : initialCounts[index]));
  const [amount, setAmount] = useState(1);
  const loose = stock - counts.reduce((total, count) => total + count, 0);
  const [lastChanged, setLastChanged] = useState<string | null>(null);
  function update(next: number[], id: string | null) {
    setCounts(next);
    setLastChanged(id);
    onResponse({ allocations: containers.map((container, index) => ({ containerId: container.id, count: next[index] })) },
      next.some((count, index) => count !== initialCounts[index]));
  }
  function move(index: number, direction: -1 | 1) {
    const change = Math.min(amount, direction === 1 ? loose : counts[index]);
    if (!change) return;
    update(counts.map((count, i) => i === index ? count + direction * change : count), containers[index].id);
  }
  return <section className="activity-family quantity-lab" aria-label="Quantity lab" data-stock={stock} data-loose={loose} data-operation={taskOperation}>
    <Mission>{scene.params.goal}</Mission>
    <p className="family-note">Each piece represents {unitValue}. Move pieces between the shared stock and the work areas.</p>
    <div className="quantity-stock" aria-label="Shared stock">
      <p><strong>{loose}</strong> pieces in the shared stock</p>
      <div className="quantity-dots" role="img" aria-label={`${loose} loose pieces`}>
        {Array.from({ length: loose }, (_, index) => <span key={index} data-testid="quantity-loose-piece" />)}
      </div>
    </div>
    <fieldset className="quantity-step" disabled={disabled}>
      <legend>Pieces to move at a time</legend>
      {[1, 5, 10].map(value => <label key={value}><input type="radio" name={`quantity-step-${scene.id}`} checked={amount === value} onChange={() => setAmount(value)} /><span>{value}</span></label>)}
    </fieldset>
    <div className="quantity-containers">
      {containers.map((container, index) => <section className={`quantity-container${lastChanged === container.id ? " family-changed" : ""}`} key={container.id} aria-label={container.label} data-count={counts[index]}>
        <div className="quantity-container-heading"><h3>{container.label}</h3><output aria-label={`${container.label} count`}>{counts[index]}</output></div>
        <div className="quantity-dots" role="img" aria-label={`${counts[index]} pieces in ${container.label}`}>
          {Array.from({ length: counts[index] }, (_, dot) => <span key={dot} />)}
          {!counts[index] ? <span className="quantity-empty">No pieces here yet</span> : null}
        </div>
        <div className="family-actions">
          <button type="button" className="family-primary" disabled={disabled || loose <= 0} aria-label={`Add pieces to ${container.label}`} onClick={() => move(index, 1)}><Plus size={17} aria-hidden="true" />Add {Math.min(amount, Math.max(0, loose))}</button>
          <button type="button" className="family-secondary" disabled={disabled || counts[index] <= 0} aria-label={`Return pieces from ${container.label}`} onClick={() => move(index, -1)}><Minus size={17} aria-hidden="true" />Return {Math.min(amount, counts[index])}</button>
        </div>
        <p className="quantity-value">{counts[index]} × {unitValue}</p>
      </section>)}
    </div>
    <p className="family-note" aria-live="polite">{stock - loose} pieces placed · {loose} in stock · {stock} altogether</p>
    {scene.phase === "guided" && containers.length > 1 && counts[0] > 0 && counts.every(count => count === counts[0]) && (taskOperation === "build" || taskOperation === "distribute") ? (
      <output className="family-note" aria-label="Equal group relationship" aria-live="polite">
        {taskOperation === "distribute"
          ? `${stock - loose} ÷ ${containers.length} = ${counts[0]} pieces in each group`
          : `${containers.length} × ${counts[0]} = ${stock - loose} pieces`}
      </output>
    ) : null}
    <button type="button" className="family-secondary" disabled={disabled || counts.every((count, index) => count === initialCounts[index])} onClick={() => update([...initialCounts], null)}><RotateCcw size={16} aria-hidden="true" />Reset work areas</button>
  </section>;
}

function SortConnect({ scene, disabled, initialResponse, onResponse }: FamilyProps<"sort_connect">) {
  const { pieces, targets, mode } = scene.params;
  const [placements, setPlacements] = useState<{ pieceId: string; targetId: string }[]>(
    initialResponse && typeof initialResponse === "object" && "placements" in initialResponse ? initialResponse.placements : []);
  const [selected, setSelected] = useState<string | null>(null);
  function update(next: typeof placements) {
    setPlacements(next);
    onResponse({ placements: next }, next.length === pieces.length);
  }
  function place(targetId: string) {
    if (!selected) return;
    update([...placements.filter(item => item.pieceId !== selected), { pieceId: selected, targetId }]);
    setSelected(null);
  }
  return <section className="activity-family sort-connect" aria-label={mode === "connect" ? "Connect pieces" : "Sort pieces"}>
    <Mission>{scene.params.goal}</Mission>
    <p className="family-note">Choose a piece, then choose where it belongs. You can move it again.</p>
    <div className="sort-piece-bank" role="group" aria-label="Pieces to place">
      {pieces.map(piece => <button type="button" key={piece.id} className="sort-piece" disabled={disabled} aria-label={`Choose piece ${piece.text}`} aria-pressed={selected === piece.id} onClick={() => setSelected(piece.id)}>
        {piece.text}{placements.some(item => item.pieceId === piece.id) ? <span aria-hidden="true"> ✓</span> : null}
      </button>)}
    </div>
    <div className="sort-targets">
      {targets.map(target => <section className="sort-target" key={target.id} aria-label={target.label}>
        <button type="button" className="sort-target-button" disabled={disabled || !selected} aria-label={`Place in ${target.label}`} onClick={() => place(target.id)}>{mode === "connect" ? "Connect to " : "Place in "}<strong>{target.label}</strong></button>
        <div className="sort-placed-pieces">
          {placements.filter(item => item.targetId === target.id).map(item => {
            const piece = pieces.find(value => value.id === item.pieceId)!;
            return <button type="button" key={item.pieceId} className="sort-placed-piece family-changed" disabled={disabled} aria-label={`Remove ${piece.text}`} onClick={() => update(placements.filter(value => value.pieceId !== item.pieceId))}>{mode === "connect" ? "↔ " : ""}{piece.text}<span aria-hidden="true"> ×</span></button>;
          })}
          {!placements.some(item => item.targetId === target.id) ? <span className="sort-empty">Your pieces go here</span> : null}
        </div>
      </section>)}
    </div>
    <p className="family-note" aria-live="polite">{placements.length} of {pieces.length} pieces placed{selected ? ` · Selected: ${pieces.find(piece => piece.id === selected)?.text}` : ""}</p>
  </section>;
}

function TextEditor({ scene, disabled, initialResponse, onResponse }: FamilyProps<"text_editor">) {
  const { mode, initialText, minLength, maxLength, minWords, wordBank } = scene.params;
  const [writtenText, setWrittenText] = useState(initialResponse && typeof initialResponse === "object" && "writtenText" in initialResponse ? initialResponse.writtenText : initialText);
  function update(value: string) {
    const next = value.slice(0, maxLength);
    setWrittenText(next);
    onResponse({ writtenText: next }, next.trim().length >= minLength && writtenWords(next) >= minWords && next !== initialText);
  }
  return <section className="activity-family text-editor" aria-label="Writing and editing studio">
    <Mission>{scene.params.goal}</Mission>
    {mode === "edit" && initialText ? <section className="text-editor-original" aria-label="Original text"><h3>Starting draft</h3><p>{initialText}</p></section> : null}
    {wordBank.length ? <div className="text-word-bank" role="group" aria-label="Words and phrases to use">{wordBank.map((word, index) => <button type="button" key={`${word}-${index}`} className="sort-piece" disabled={disabled} aria-label={`Use ${word}`} onClick={() => update(writtenText + (writtenText && !/\s$/.test(writtenText) ? " " : "") + word)}>{word}</button>)}</div> : null}
    <label className="family-field-label" htmlFor={`draft-${scene.id}`}>{mode === "edit" ? "Revise your draft" : "Your writing"}</label>
    <textarea id={`draft-${scene.id}`} className="text-editor-input" rows={8} maxLength={maxLength} disabled={disabled} value={writtenText} onChange={event => update(event.target.value)} autoCapitalize="off" autoCorrect="off" spellCheck={false} />
    <p className="family-note" aria-live="polite">{writtenWords(writtenText)} words · {writtenText.length} of {maxLength} characters{writtenText.trim().length < minLength ? ` · Write at least ${minLength} characters` : ""}{minWords ? ` · Goal: at least ${minWords} words` : ""}</p>
    <section className="text-editor-published" aria-label="Your work in the scene" aria-live="polite"><p className="account-eyebrow">YOUR WORK</p><p>{writtenText || "Your words will appear here."}</p></section>
  </section>;
}

function writtenWords(value: string) {
  return value.match(/[\p{L}\p{N}_]+(?:['’\-][\p{L}\p{N}_]+)*/gu)?.length ?? 0;
}

function amount(value: string): number {
  const [numerator, denominator] = value.split("/").map(Number);
  return numerator / (denominator || 1);
}

function scaleLabel(origin: string, step: string, tick: number): string {
  if (!origin.includes("/") && !step.includes("/")) return Number((amount(origin) + tick * amount(step)).toFixed(5)).toString();
  function ratio(value: string): [bigint, bigint] {
    const parts = value.replace(/\s/g, "").split("/");
    if (parts.length === 2) return [BigInt(parts[0]), BigInt(parts[1])];
    const places = parts[0].split(".")[1]?.length ?? 0;
    return [BigInt(parts[0].replace(".", "")), BigInt(10) ** BigInt(places)];
  }
  const [a, b] = ratio(origin), [c, d] = ratio(step);
  let numerator = a * d + c * BigInt(tick) * b, denominator = b * d;
  let left = numerator < BigInt(0) ? -numerator : numerator, right = denominator;
  while (right !== BigInt(0)) { const next = left % right; left = right; right = next; }
  if (left) { numerator /= left; denominator /= left; }
  return denominator === BigInt(1) ? numerator.toString() : `${numerator}/${denominator}`;
}

function MathWorkspace({ scene, disabled, initialResponse, onResponse }: FamilyProps<"math_workspace">) {
  const { mode, width, height, step, origin, unitLabel, objects, tokens } = scene.params;
  const [marks, setMarks] = useState<{ x: number; y: number }[]>(initialResponse && typeof initialResponse === "object" && "marks" in initialResponse ? initialResponse.marks : []);
  const [text, setText] = useState(initialResponse && typeof initialResponse === "object" && "marks" in initialResponse ? initialResponse.text : "");
  const [hand, setHand] = useState<"hour" | "minute">("hour");
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const line = mode === "ruler" || mode === "number_line";
  const boardHeight = line ? Math.max(4, height) : height;
  function update(nextMarks: typeof marks, nextText: string) {
    setMarks(nextMarks); setText(nextText);
    onResponse({ marks: nextMarks, text: nextText }, nextMarks.length > 0 || Boolean(nextText.trim()));
  }
  function mark(x: number, y: number) {
    const exists = marks.some(point => point.x === x && point.y === y);
    update(exists ? marks.filter(point => point.x !== x || point.y !== y) : [...marks, { x, y }].slice(-441), text);
  }
  const scale = 24;
  const offset = 28;
  const viewWidth = width * scale + offset * 2;
  const viewHeight = boardHeight * scale + offset * 2;
  const sx = (x: number) => offset + x * scale;
  const sy = (y: number) => offset + (boardHeight - y) * scale;
  function label(x: number) { return scaleLabel(origin, step, x); }
  const circles = Array.from({ length: (width + 1) * (line ? 1 : height + 1) }, (_, index) => ({ x: index % (width + 1), y: line ? 0 : Math.floor(index / (width + 1)) }));
  return <section className="activity-family math-workspace" aria-label="Math workspace" data-mode={mode}>
    <Mission>{scene.params.goal}</Mission>
    <p className="family-note">{mode === "equation" ? "Use the pieces or write to build your math." : mode === "clock" ? "Move the hands to build your time." : "Tap points to mark or build on the board. Tap a selected point to remove it."}</p>
    <div className="math-workspace-board">
      {mode === "clock" ? <ClockBoard width={width} height={height} objects={objects} marks={marks} hand={hand} disabled={disabled} onChange={next => update(next, text)} /> : mode === "angle" ? <AngleBoard marks={marks} objects={objects} disabled={disabled} onChange={next => update(next, text)} /> : mode === "balance" || mode === "vessel" ? <MeasureBoard scene={scene} marks={marks} disabled={disabled} onChange={next => update(next, text)} /> : <svg viewBox={`0 0 ${viewWidth} ${viewHeight}`} role="group" aria-label={`${mode.replace("_", " ")} board`} style={{ minWidth: Math.max(280, viewWidth) }}>
        {!line ? Array.from({ length: width + 1 }, (_, x) => <line key={`x-${x}`} x1={sx(x)} y1={sy(0)} x2={sx(x)} y2={sy(height)} className="math-grid-line" />) : null}
        {!line ? Array.from({ length: height + 1 }, (_, y) => <line key={`y-${y}`} x1={sx(0)} y1={sy(y)} x2={sx(width)} y2={sy(y)} className="math-grid-line" />) : null}
        {!line ? <>{Array.from({ length: height + 1 }, (_, y) => <text key={`yl-${y}`} x={sx(0) - 9} y={sy(y) + 3} textAnchor="end" className="math-tick-label">{mode === "chart" ? label(y) : y}</text>)}{Array.from({ length: width + 1 }, (_, x) => <text key={`xl-${x}`} x={sx(x)} y={sy(0) + 17} textAnchor="middle" className="math-tick-label">{x}</text>)}</> : null}
        {line ? <line x1={sx(0)} y1={sy(0)} x2={sx(width)} y2={sy(0)} className="math-axis" /> : null}
        {objects.map(object => {
          const x = sx(object.x), y = sy(object.y), w = object.width * scale, h = object.height * scale;
          return <g key={object.id} aria-label={object.label} role="img">
            {object.shape === "rect" ? <rect x={x} y={y - h} width={w} height={h} className="math-board-object" />
              : object.shape === "circle" ? <ellipse cx={x + w / 2} cy={y - h / 2} rx={w / 2} ry={h / 2} className="math-board-object" />
              : object.shape === "triangle" ? <polygon points={`${x},${y} ${x + w},${y} ${x + w / 2},${y - h}`} className="math-board-object" />
              : object.shape === "line" ? <line x1={x} y1={y} x2={x + w} y2={y - h} className="math-board-segment" /> : null}
            {object.label ? <text x={x + w / 2} y={object.shape === "text" ? y : y - h - 5} textAnchor="middle" className="math-object-label">{object.label}</text> : null}
          </g>;
        })}
        {marks.length > 1 && ["shape", "grid"].includes(mode) ? <polyline points={marks.map(point => `${sx(point.x)},${sy(point.y)}`).join(" ")} className="math-child-path" fill="none" /> : null}
        {circles.map(({ x, y }) => {
          const selected = marks.some(point => point.x === x && point.y === y);
          return <g key={`${x}-${y}`}>
            {line ? <><line x1={sx(x)} x2={sx(x)} y1={sy(0) - 8} y2={sy(0) + 8} className="math-axis" /><text x={sx(x)} y={sy(0) + 22} textAnchor="middle" className="math-tick-label">{label(x)}</text></> : null}
            <circle cx={sx(x)} cy={sy(y)} r={selected ? 6 : 4} className={selected ? "math-mark selected" : "math-mark"} role="button" tabIndex={disabled ? -1 : 0} aria-label={line ? `Mark ${label(x)} ${unitLabel}` : `Mark point ${x}, ${y}`} aria-pressed={selected} onClick={() => { if (!disabled) mark(x, y); }} onKeyDown={event => { if (!disabled && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); mark(x, y); } }} />
          </g>;
        })}
        {!line ? <text x={sx(width / 2)} y={sy(0) + 28} textAnchor="middle" className="math-tick-label">{unitLabel}</text> : null}
        <circle cx={sx(cursor.x)} cy={sy(cursor.y)} r="9" className="math-cursor" />
      </svg>}
    </div>
    {mode === "clock" ? <><fieldset className="clock-hand-selector" disabled={disabled}><legend>Hand to move</legend>{(["hour", "minute"] as const).map(value => <label key={value}><input type="radio" name={`clock-hand-${scene.id}`} checked={hand === value} onChange={() => setHand(value)} />{value === "hour" ? "Hour hand" : "Minute hand"}</label>)}</fieldset><div className="family-actions"><button type="button" className="family-secondary" disabled={disabled} onClick={() => update([{ x: ((marks[0]?.x ?? 0) + 11) % 12, y: marks[0]?.y ?? 0 }], text)}>Hour back</button><button type="button" className="family-secondary" disabled={disabled} onClick={() => update([{ x: ((marks[0]?.x ?? 0) + 1) % 12, y: marks[0]?.y ?? 0 }], text)}>Hour forward</button><button type="button" className="family-secondary" disabled={disabled} onClick={() => update([{ x: marks[0]?.x ?? 0, y: ((marks[0]?.y ?? 0) + 59) % 60 }], text)}>Minute back</button><button type="button" className="family-secondary" disabled={disabled} onClick={() => update([{ x: marks[0]?.x ?? 0, y: ((marks[0]?.y ?? 0) + 1) % 60 }], text)}>Minute forward</button></div></> : null}
    {!["clock", "angle", "balance", "vessel"].includes(mode) ? <div className="math-cursor-controls"><output aria-live="polite">Marker: {line ? `${label(cursor.x)} ${unitLabel}` : `${cursor.x}, ${cursor.y}`}</output><div className="family-actions"><button type="button" className="family-secondary" disabled={disabled || cursor.x <= 0} onClick={() => setCursor(value => ({ ...value, x: value.x - 1 }))}>Move left</button><button type="button" className="family-secondary" disabled={disabled || cursor.x >= width} onClick={() => setCursor(value => ({ ...value, x: value.x + 1 }))}>Move right</button>{!line ? <><button type="button" className="family-secondary" disabled={disabled || cursor.y >= height} onClick={() => setCursor(value => ({ ...value, y: value.y + 1 }))}>Move up</button><button type="button" className="family-secondary" disabled={disabled || cursor.y <= 0} onClick={() => setCursor(value => ({ ...value, y: value.y - 1 }))}>Move down</button></> : null}<button type="button" className="family-primary" disabled={disabled} onClick={() => mark(cursor.x, cursor.y)}>Place or remove marker</button></div></div> : null}
    {tokens.length ? <div className="math-token-bank" role="group" aria-label="Math pieces">{tokens.map(token => <button type="button" key={token.id} className="sort-piece" disabled={disabled} onClick={() => update(marks, text + token.text)} aria-label={`Use math piece ${token.text}`}>{token.text}</button>)}</div> : null}
    <label className="family-field-label" htmlFor={`math-text-${scene.id}`}>Your math or measurement</label>
    <textarea id={`math-text-${scene.id}`} rows={3} maxLength={2000} disabled={disabled} value={text} onChange={event => update(marks, event.target.value)} autoCapitalize="off" autoCorrect="off" spellCheck={false} />
    <p className="family-note" aria-live="polite">{marks.length} marks on your board{marks.length && scene.phase === "guided" && line ? ` · Marked: ${marks.map(point => `${label(point.x)} ${unitLabel}`).join(", ")}` : ""}</p>
    <button type="button" className="family-secondary" disabled={disabled || (!marks.length && !text)} onClick={() => update([], "")}><RotateCcw size={16} aria-hidden="true" />Clear workspace</button>
  </section>;
}

function MeasureBoard({ scene, marks, disabled, onChange }: { scene: FamilyScene<"math_workspace">; marks: { x: number; y: number }[]; disabled: boolean; onChange: (marks: { x: number; y: number }[]) => void }) {
  const { width, origin, step, objects, unitLabel, mode } = scene.params;
  const tick = marks[0]?.x ?? 0;
  const value = amount(origin) + tick * amount(step);
  const load = objects.reduce((total, object) => total + (object.value ? amount(object.value) : 0), 0);
  const tilt = Math.max(-13, Math.min(13, (value - load) / Math.max(load, 1) * 13));
  return <div className={`measurement-board measurement-${mode}`}>
    {mode === "balance" ? <svg viewBox="0 0 240 170" role="img" aria-label={`Balance scale${marks.length ? ` with ${Number(value.toFixed(5))} ${unitLabel} on the right` : ""}`}>
      <path d="M 105 145 L 120 64 L 135 145 Z" className="balance-stand" />
      <g transform={`rotate(${tilt},120,55)`} className="balance-beam">
        <line x1="38" y1="55" x2="202" y2="55" className="balance-arm" />
        <path d="M 38 55 L 13 107 L 63 107 Z" className="balance-pan" />
        <path d="M 202 55 L 177 107 L 227 107 Z" className="balance-pan" />
        <rect x="23" y="85" width="30" height="20" rx="3" className="balance-load" />
        <text x="38" y="100" textAnchor="middle" className="balance-object-label">?</text>
        {Array.from({ length: Math.min(tick, 12) }, (_, index) => <rect key={index} x={181 + index % 4 * 11} y={98 - Math.floor(index / 4) * 11} width="10" height="10" rx="2" className="balance-weight" />)}
      </g>
      <circle cx="120" cy="55" r="5" className="balance-pivot" />
      <line x1="85" y1="145" x2="155" y2="145" className="balance-arm" />
      <text x="38" y="155" textAnchor="middle" className="balance-caption">{objects[0]?.label || "Object"}</text>
      <text x="201" y="155" textAnchor="middle" className="balance-caption">Counterweights</text>
    </svg> : <svg viewBox="0 0 180 210" role="img" aria-label={`Graduated vessel${marks.length ? ` filled to ${Number(value.toFixed(5))} ${unitLabel}` : ""}`}>
      <path d="M 45 15 L 45 185 Q 45 195 55 195 L 125 195 Q 135 195 135 185 L 135 15" className="vessel-outline" />
      <rect x="47" y={193 - tick / width * 170} width="86" height={tick / width * 170} className="vessel-liquid" />
      {Array.from({ length: width + 1 }, (_, index) => <g key={index}><line x1="112" x2="135" y1={193 - index / width * 170} y2={193 - index / width * 170} className="vessel-tick" /><text x="140" y={196 - index / width * 170} className="vessel-label">{scaleLabel(origin, step, index)}</text></g>)}
      <text x="90" y="208" textAnchor="middle" className="vessel-label">{unitLabel}</text>
    </svg>}
    <label className="family-field-label" htmlFor={`measurement-${scene.id}`}>{mode === "balance" ? "Move the counterweights" : "Fill or empty the vessel"}</label>
    <input id={`measurement-${scene.id}`} type="range" min={0} max={width} step={1} value={tick} disabled={disabled} onChange={event => onChange([{ x: Number(event.target.value), y: 0 }])} aria-label={mode === "balance" ? "Counterweight amount" : "Vessel fill level"} />
    <output aria-live="polite" className="measurement-value">{scaleLabel(origin, step, tick)} {unitLabel}</output>
  </div>;
}

function ClockBoard({ width, height, objects, marks, hand, disabled, onChange }: { width: number; height: number; objects: FamilyScene<"math_workspace">["params"]["objects"]; marks: { x: number; y: number }[]; hand: "hour" | "minute"; disabled: boolean; onChange: (marks: { x: number; y: number }[]) => void }) {
  const hour = marks[0]?.x ?? 0;
  const minute = marks[0]?.y ?? 0;
  function move(index: number) {
    onChange([{ x: hand === "hour" ? index : hour, y: hand === "minute" ? index * 5 : minute }]);
  }
  const endpoint = (ticks: number, total: number, length: number) => ({ x: 100 + Math.sin(ticks / total * Math.PI * 2) * length, y: 100 - Math.cos(ticks / total * Math.PI * 2) * length });
  const h = endpoint(hour % 12 + minute / 60, 12, 47), m = endpoint(minute, 60, 68);
  const given = objects.find(object => object.value !== null);
  const givenTime = given ? amount(given.value!) : null;
  const givenHour = givenTime === null ? null : Math.floor(givenTime / 60) % 12;
  const givenMinute = givenTime === null ? null : givenTime % 60;
  const gh = givenHour === null ? null : endpoint(givenHour + givenMinute! / 60, 12, 47);
  const gm = givenMinute === null ? null : endpoint(givenMinute, 60, 68);
  return <div className="clock-workspace">
    {given ? <figure className="clock-source"><figcaption>{given.label}</figcaption><svg viewBox="0 0 200 200" role="img" aria-label="Clock to read"><circle cx="100" cy="100" r="87" className="clock-face" />{Array.from({ length: 12 }, (_, index) => { const point = endpoint(index, 12, 75); return <text key={index} x={point.x} y={point.y + 4} textAnchor="middle" className="clock-number">{index || 12}</text>; })}<line x1="100" y1="100" x2={gh!.x} y2={gh!.y} className="clock-hour-hand" /><line x1="100" y1="100" x2={gm!.x} y2={gm!.y} className="clock-minute-hand" /><circle cx="100" cy="100" r="4" className="clock-center" /></svg></figure> : null}
    <svg viewBox="0 0 200 200" role="group" aria-label="Clock face" data-board-width={width} data-board-height={height}>
    <circle cx="100" cy="100" r="87" className="clock-face" />
    {Array.from({ length: 12 }, (_, index) => {
      const point = endpoint(index, 12, 75);
      return <g key={index} role="button" aria-label={`Move ${hand} hand to ${index || 12}`} tabIndex={disabled ? -1 : 0} onClick={() => { if (!disabled) move(index); }} onKeyDown={event => { if (!disabled && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); move(index); } }}><circle cx={point.x} cy={point.y} r="12" className="clock-tick-hit" /><text x={point.x} y={point.y + 4} textAnchor="middle" className="clock-number">{index || 12}</text></g>;
    })}
    {marks.length ? <><line x1="100" y1="100" x2={h.x} y2={h.y} className="clock-hour-hand" /><line x1="100" y1="100" x2={m.x} y2={m.y} className="clock-minute-hand" /></> : null}
    <circle cx="100" cy="100" r="4" className="clock-center" />
  </svg>{!marks.length ? <p className="family-note">Your clock has no time set yet.</p> : null}</div>;
}

function AngleBoard({ marks, objects, disabled, onChange }: { marks: { x: number; y: number }[]; objects: FamilyScene<"math_workspace">["params"]["objects"]; disabled: boolean; onChange: (marks: { x: number; y: number }[]) => void }) {
  const degrees = marks[0]?.x ?? 0;
  const endpoint = (angle: number, radius: number) => ({ x: 110 + Math.cos(angle * Math.PI / 180) * radius, y: 110 - Math.sin(angle * Math.PI / 180) * radius });
  const ray = endpoint(degrees, 88);
  return <div className="angle-workspace">
    <svg viewBox="0 0 220 135" role="img" aria-label={`Protractor with a movable ray${marks.length ? ` at ${degrees} degrees` : ""}`}>
      <path d="M 10 110 A 100 100 0 0 1 210 110 L 10 110" className="protractor-body" />
      {Array.from({ length: 37 }, (_, index) => index * 5).map(angle => {
        const outer = endpoint(angle, 100), inner = endpoint(angle, angle % 10 === 0 ? 89 : 94), label = endpoint(angle, 78);
        return <g key={angle}><line x1={outer.x} y1={outer.y} x2={inner.x} y2={inner.y} className="protractor-tick" />{angle % 30 === 0 ? <text x={label.x} y={label.y + 3} textAnchor="middle" className="protractor-label">{angle}</text> : null}</g>;
      })}
      {objects.filter(object => object.value !== null).map(object => {
        const given = endpoint(Math.max(0, Math.min(180, amount(object.value!))), 95);
        return <g key={object.id} role="img" aria-label={object.label}><line x1="110" y1="110" x2="205" y2="110" className="angle-given-ray" /><line x1="110" y1="110" x2={given.x} y2={given.y} className="angle-given-ray" /></g>;
      })}
      <line x1="110" y1="110" x2="205" y2="110" className="math-child-path" />
      <line x1="110" y1="110" x2={ray.x} y2={ray.y} className="angle-ray" />
      <circle cx="110" cy="110" r="3" className="clock-center" />
    </svg>
    <label className="family-field-label" htmlFor="angle-ray-control">Move the ray</label>
    <input id="angle-ray-control" type="range" min={0} max={180} step={1} disabled={disabled} value={degrees} onChange={event => onChange([{ x: Number(event.target.value), y: 0 }])} aria-label="Angle ray" />
  </div>;
}

export function FamilyControl(props: FamilyProps<FamilyComponent>) {
  const { scene, sessionId, disabled, initialResponse, onResponse } = props;
  switch (scene.component) {
    case "quantity_lab": return <QuantityLab {...props} scene={scene} />;
    case "math_workspace": return <MathWorkspace {...props} scene={scene} />;
    case "sort_connect": return <SortConnect {...props} scene={scene} />;
    case "text_editor": return <TextEditor {...props} scene={scene} />;
    case "oral_studio": return <><Mission>{scene.params.goal}</Mission><OralControl sessionId={sessionId} sceneId={scene.id} mode={scene.params.mode} passage={scene.params.passage} listenText={scene.params.listenText} disabled={disabled} recordingId={initialResponse && typeof initialResponse === "object" && "recordingId" in initialResponse ? initialResponse.recordingId : null} onResponse={onResponse} /></>;
    case "drawing_studio": return <><Mission>{scene.params.goal}</Mission>{scene.params.labels.length ? <p className="family-note">{scene.params.labels.join(" · ")}</p> : null}<DrawingControl sceneId={scene.id} disabled={disabled} guide={scene.params.backgroundPrompt} initialStrokes={initialResponse && typeof initialResponse === "object" && "strokes" in initialResponse ? initialResponse.strokes : []} onResponse={onResponse} /></>;
  }
}
