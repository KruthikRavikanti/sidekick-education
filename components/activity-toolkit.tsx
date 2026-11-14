"use client";

import { ArrowDown, ArrowUp, Package, Pin, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import type { ActivityResponse, ActivityScene } from "@/lib/activity-types";

type ToolkitComponent = "bundle_builder" | "tile_order" | "evidence_board";
type ToolkitScene<C extends ToolkitComponent> = Extract<ActivityScene, { component: C }>;
interface ToolkitProps<C extends ToolkitComponent> {
  scene: ToolkitScene<C>;
  disabled: boolean;
  onResponse: (response: ActivityResponse, ready: boolean) => void;
  initialResponse?: ActivityResponse | null;
}

function Mission({ goal }: { goal: string }) {
  return <p className="activity-toolkit-goal">{goal}</p>;
}

export function BundleBuilder({ scene, disabled, onResponse, initialResponse }: ToolkitProps<"bundle_builder">) {
  const { total, groupSize, itemLabel, groupLabel, goal } = scene.params;
  const maxBundles = Math.floor(total / groupSize);
  const initialBundles = initialResponse && typeof initialResponse === "object" && "bundles" in initialResponse
    ? Math.max(0, Math.min(maxBundles, initialResponse.bundles)) : 0;
  const [bundles, setBundles] = useState(initialBundles);
  const [animatedGroup, setAnimatedGroup] = useState<number | null>(null);
  const loose = total - bundles * groupSize;
  function update(next: number) {
    setBundles(next);
    setAnimatedGroup(next > bundles ? next - 1 : null);
    onResponse({ bundles: next }, next > 0);
  }
  return (
    <section className="activity-manipulative activity-toolkit bundle-builder" aria-label="Bundle objects"
      data-bundles={bundles} data-loose={loose} data-total={total}>
      <Mission goal={goal} />
      <div className="bundle-workspace">
        <div className="bundle-group-zone" aria-label={groupLabel}>
          <p className="toolkit-zone-label"><Package size={17} aria-hidden="true" />{groupLabel}</p>
          <div className="bundle-groups">
            {bundles === 0 ? <p className="toolkit-placeholder">Your groups go here</p> : null}
            {Array.from({ length: bundles }, (_, index) => (
              <div key={index} className={`bundle-group${animatedGroup === index ? " toolkit-animate" : ""}`}
                data-testid="object-group" role="img" aria-label={`Group ${index + 1}: ${groupSize} ${itemLabel}`}>
                <div className="bundle-packed-dots" aria-hidden="true">
                  {Array.from({ length: groupSize }, (_, dot) => <span key={dot} />)}
                </div>
                <strong aria-hidden="true">{groupSize}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="bundle-loose-zone">
          <p className="toolkit-zone-label">Loose {itemLabel}</p>
          <div className="bundle-loose-objects" role="img" aria-label={`${loose} loose ${itemLabel}`}>
            {Array.from({ length: loose }, (_, index) => <span key={index} data-testid="loose-object" aria-hidden="true" />)}
            {loose === 0 ? <span className="toolkit-placeholder">All packed</span> : null}
          </div>
        </div>
      </div>
      <div className="bundle-number-display" aria-live="polite" aria-atomic="true">
        <output aria-label="Bundle count"><strong>{bundles}</strong> groups + <strong>{loose}</strong> loose</output>
        {scene.phase === "guided" ? <p>{bundles} × {groupSize} + {loose} = {total} {itemLabel}</p> : null}
      </div>
      <div className="toolkit-actions">
        <button className="toolkit-action-primary" type="button" disabled={disabled || loose < groupSize}
          onClick={() => update(bundles + 1)}><Package size={18} aria-hidden="true" />Bundle {groupSize}</button>
        <button className="toolkit-action-secondary" type="button" disabled={disabled || bundles === 0}
          onClick={() => update(bundles - 1)}>Unpack a group</button>
      </div>
      <button className="text-button toolkit-reset" type="button" disabled={disabled || bundles === 0}
        onClick={() => update(0)}><RotateCcw size={14} aria-hidden="true" />Reset bundles</button>
    </section>
  );
}

export function TileOrder({ scene, disabled, onResponse, initialResponse }: ToolkitProps<"tile_order">) {
  const { tiles, goal, ordering } = scene.params;
  const initialOrder = initialResponse && typeof initialResponse === "object" && "order" in initialResponse
    ? initialResponse.order.filter((id, index, all) => tiles.some((tile) => tile.id === id) && all.indexOf(id) === index) : [];
  const [order, setOrder] = useState(initialOrder);
  const [animateId, setAnimateId] = useState<string | null>(null);
  const sentence = ordering === "sentence";
  function update(next: string[], changedId: string | null = null) {
    setOrder(next);
    setAnimateId(changedId);
    onResponse({ order: next }, next.length === tiles.length);
  }
  function move(index: number, direction: -1 | 1) {
    const next = [...order];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    update(next, order[index]);
  }
  const arranged = order.map((id) => tiles.find((tile) => tile.id === id)!);
  return (
    <section className="activity-manipulative activity-toolkit tile-order" aria-label="Arrange tiles" data-order={order.join(",")}>
      <Mission goal={goal} />
      <p className="activity-control-instruction">Place the tiles in order. Use the arrows to move them.</p>
      <ol className="tile-order-stage" aria-label="Your arrangement">
        {order.length === 0 ? <li className="toolkit-placeholder">Your {sentence ? "sentence" : "sequence"} starts here</li> : null}
        {arranged.map((tile, index) => (
          <li className={`tile-order-card${animateId === tile.id ? " toolkit-animate" : ""}`} key={tile.id} data-tile-id={tile.id}>
            <span className="tile-order-position" aria-hidden="true">{index + 1}</span>
            <p>{tile.text}</p>
            <div className="tile-order-card-actions">
              <button type="button" disabled={disabled || index === 0} aria-label={`Move tile ${index + 1} earlier`}
                onClick={() => move(index, -1)}><ArrowUp size={17} aria-hidden="true" /></button>
              <button type="button" disabled={disabled || index === order.length - 1} aria-label={`Move tile ${index + 1} later`}
                onClick={() => move(index, 1)}><ArrowDown size={17} aria-hidden="true" /></button>
              <button type="button" disabled={disabled} aria-label={`Remove tile ${index + 1}`}
                onClick={() => update(order.filter((id) => id !== tile.id))}><X size={17} aria-hidden="true" /></button>
            </div>
          </li>
        ))}
      </ol>
      <div className="tile-order-bank" role="group" aria-label="Available tiles">
        {tiles.map((tile) => (
          <button key={tile.id} className="tile-order-bank-card" type="button" disabled={disabled || order.includes(tile.id)}
            aria-label={`Place ${tile.text}`} onClick={() => update([...order, tile.id], tile.id)}>{tile.text}</button>
        ))}
      </div>
      <div className="tile-order-preview" aria-live="polite" aria-atomic="true">
        <output aria-label="Your sequence">{arranged.map((tile) => tile.text).join(sentence ? " " : " → ") || "No tiles placed yet."}</output>
        <p>{order.length} of {tiles.length} tiles placed</p>
      </div>
      <button className="text-button toolkit-reset" type="button" disabled={disabled || order.length === 0}
        onClick={() => update([])}><RotateCcw size={14} aria-hidden="true" />Reset arrangement</button>
    </section>
  );
}

export function EvidenceBoard({ scene, disabled, onResponse, initialResponse }: ToolkitProps<"evidence_board">) {
  const { sentences, boardLabel, goal } = scene.params;
  const initialSentence = initialResponse && typeof initialResponse === "object" && "sentenceId" in initialResponse
    && sentences.some((sentence) => sentence.id === initialResponse.sentenceId) ? initialResponse.sentenceId : null;
  const [candidateId, setCandidateId] = useState(initialSentence);
  const [placedId, setPlacedId] = useState(initialSentence);
  const [animate, setAnimate] = useState(false);
  const placedSentence = sentences.find((sentence) => sentence.id === placedId);
  function choose(id: string) {
    setCandidateId(id);
    onResponse({ sentenceId: id }, id === placedId);
  }
  function place() {
    if (!candidateId) return;
    setPlacedId(candidateId);
    setAnimate(true);
    onResponse({ sentenceId: candidateId }, true);
  }
  return (
    <section className="activity-manipulative activity-toolkit evidence-board" aria-label="Evidence clue board"
      data-selected-sentence={placedId ?? ""} data-pending-sentence={candidateId ?? ""}>
      <Mission goal={goal} />
      <div className="evidence-passage" role="group" aria-label="Story sentences">
        <p className="toolkit-zone-label">Read and choose a sentence</p>
        {sentences.map((sentence, index) => (
          <button key={sentence.id} type="button" className="evidence-sentence" data-selected={candidateId === sentence.id}
            aria-pressed={candidateId === sentence.id} aria-label={`Choose sentence ${index + 1}`} disabled={disabled}
            onClick={() => choose(sentence.id)}>
            <span className="evidence-sentence-number" aria-hidden="true">{index + 1}</span>
            <span>{sentence.text}</span>
          </button>
        ))}
      </div>
      <button className="toolkit-action-primary evidence-place" type="button" disabled={disabled || !candidateId || candidateId === placedId}
        onClick={place}><Pin size={17} aria-hidden="true" />Place on clue board</button>
      <section className="evidence-clue-board" aria-label={boardLabel} data-testid="clue-board" aria-live="polite" aria-atomic="true">
        <p className="toolkit-zone-label"><Pin size={16} aria-hidden="true" />{boardLabel}</p>
        {placedSentence ? <blockquote key={placedId} className={animate ? "toolkit-animate" : ""}>{placedSentence.text}</blockquote>
          : <p className="toolkit-placeholder">Your chosen evidence goes here</p>}
      </section>
    </section>
  );
}
