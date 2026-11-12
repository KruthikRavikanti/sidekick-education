"use client";

import { useState } from "react";
import type { ActivityResponse, ActivityScene } from "@/lib/activity-types";

interface SceneControlProps {
  scene: ActivityScene;
  disabled: boolean;
  onResponse: (response: ActivityResponse, ready: boolean) => void;
  initialResponse?: ActivityResponse | null;
  showHint?: boolean;
}

function FractionBuilder({
  scene,
  disabled,
  onResponse,
  initialResponse,
  showHint,
}: SceneControlProps & {
  scene: Extract<ActivityScene, { component: "fraction_builder" }>;
}) {
  const [selected, setSelected] = useState<number[]>(
    initialResponse &&
      typeof initialResponse === "object" &&
      "selectedParts" in initialResponse
      ? initialResponse.selectedParts
      : [],
  );
  const total = scene.params.denominator;
  function toggle(index: number) {
    const next = selected.includes(index)
      ? selected.filter((part) => part !== index)
      : [...selected, index].sort((left, right) => left - right);
    setSelected(next);
    onResponse({ selectedParts: next }, true);
  }
  return (
    <div
      className={`activity-manipulative ${showHint ? "activity-show-hint" : ""}`}
    >
      <p className="activity-control-instruction">
        Tap equal pieces to build your fraction.
      </p>
      <div className="activity-fraction-scroll">
        <div
          className="activity-fraction-whole"
          style={{ gridTemplateColumns: `repeat(${total}, minmax(44px, 1fr))` }}
          role="group"
          aria-label={`One whole split into ${total} equal pieces`}
        >
          {Array.from({ length: total }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Piece ${index + 1} of ${total}`}
              aria-pressed={selected.includes(index)}
              disabled={disabled}
              onClick={() => toggle(index)}
            >
              <span aria-hidden="true">
                {selected.includes(index) ? "●" : "○"}
              </span>
            </button>
          ))}
        </div>
      </div>
      <p className="activity-selection" aria-live="polite">
        <strong>
          {selected.length}/{total}
        </strong>{" "}
        of the whole selected
      </p>
    </div>
  );
}

function NumberLine({
  scene,
  disabled,
  onResponse,
  initialResponse,
  showHint,
}: SceneControlProps & {
  scene: Extract<ActivityScene, { component: "number_line" }>;
}) {
  const [selected, setSelected] = useState<number | null>(
    initialResponse &&
      typeof initialResponse === "object" &&
      "tick" in initialResponse
      ? initialResponse.tick
      : null,
  );
  const total = scene.params.denominator;
  function select(value: number) {
    setSelected(value);
    onResponse({ tick: value }, true);
  }
  return (
    <div
      className={`activity-manipulative ${showHint ? "activity-show-hint" : ""}`}
    >
      <label
        className="activity-control-instruction"
        htmlFor={`line-${scene.id}`}
      >
        Move the marker. You can also use the arrow keys.
      </label>
      <div className="activity-number-line">
        {showHint ? (
          <span
            className="activity-line-unit-hint"
            style={{ width: `calc((100% - 28px) / ${total})` }}
            aria-hidden="true"
          />
        ) : null}
        <input
          id={`line-${scene.id}`}
          type="range"
          min={0}
          max={total}
          step={1}
          value={selected ?? 0}
          disabled={disabled}
          aria-label="Place the fraction on the number line"
          aria-valuetext={
            selected === null ? "Choose a position" : `${selected}/${total}`
          }
          onChange={(event) => select(Number(event.target.value))}
        />
        <div className="activity-line-ticks" aria-hidden="true">
          {Array.from({ length: total + 1 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
        <div className="activity-line-ends" aria-hidden="true">
          <span>0</span>
          <span>1</span>
        </div>
      </div>
      <div className="activity-line-actions">
        <button
          type="button"
          disabled={disabled || selected === 0}
          onClick={() => select(Math.max(0, (selected ?? 1) - 1))}
          aria-label="Move marker one step left"
        >
          −
        </button>
        <p className="activity-selection" aria-live="polite">
          {selected === null ? "Choose a position" : `${selected}/${total}`}
        </p>
        <button
          type="button"
          disabled={disabled || selected === total}
          onClick={() => select(Math.min(total, (selected ?? -1) + 1))}
          aria-label="Move marker one step right"
        >
          +
        </button>
      </div>
    </div>
  );
}

function WordTiles({
  scene,
  disabled,
  onResponse,
  initialResponse,
  showHint,
}: SceneControlProps & {
  scene: Extract<ActivityScene, { component: "word_tiles" }>;
}) {
  const [selected, setSelected] = useState<string[]>(
    initialResponse &&
      typeof initialResponse === "object" &&
      "tileIds" in initialResponse
      ? initialResponse.tileIds
      : [],
  );
  const tiles = scene.params.tiles;
  function update(next: string[]) {
    setSelected(next);
    onResponse({ tileIds: next }, next.length > 0);
  }
  return (
    <div
      className={`activity-manipulative ${showHint ? "activity-show-hint" : ""}`}
    >
      <p className="activity-base-word">
        Starting word: <strong>{scene.params.baseWord}</strong>
      </p>
      <p className="activity-control-instruction">
        Tap tiles in order. Tap a chosen tile to put it back.
      </p>
      <div className="activity-word-answer" role="group" aria-label="Your word">
        {selected.length === 0 ? (
          <span className="activity-tile-placeholder">
            Build your word here
          </span>
        ) : (
          selected.map((id, index) => {
            const tile = tiles.find((item) => item.id === id)!;
            return (
              <button
                className="activity-tile selected"
                type="button"
                key={id}
                disabled={disabled}
                aria-label={`Remove ${tile.text}, position ${index + 1}`}
                onClick={() => update(selected.filter((item) => item !== id))}
              >
                {tile.text}
              </button>
            );
          })
        )}
      </div>
      <p className="activity-sr-only" aria-live="polite">
        Your word:{" "}
        {selected
          .map((id) => tiles.find((tile) => tile.id === id)?.text)
          .join("") || "empty"}
      </p>
      <div
        className="activity-tile-bank"
        role="group"
        aria-label="Available letter tiles"
      >
        {tiles.map((tile) => (
          <button
            className="activity-tile"
            type="button"
            key={tile.id}
            disabled={disabled || selected.includes(tile.id)}
            aria-label={`Add ${tile.text}`}
            onClick={() => update([...selected, tile.id])}
          >
            {tile.text}
          </button>
        ))}
      </div>
    </div>
  );
}

function WordChoice({
  scene,
  disabled,
  onResponse,
  initialResponse,
}: SceneControlProps & {
  scene: Extract<ActivityScene, { component: "word_choice" }>;
}) {
  return (
    <fieldset className="activity-word-choices" disabled={disabled}>
      <legend className="activity-base-word">
        Starting word: <strong>{scene.params.baseWord}</strong>
      </legend>
      {scene.params.options.map((choice) => (
        <label className="activity-word-choice" key={choice.id}>
          <input
            type="radio"
            name={`choice-${scene.id}`}
            value={choice.id}
            defaultChecked={Boolean(
              initialResponse &&
                typeof initialResponse === "object" &&
                "choiceId" in initialResponse &&
                initialResponse.choiceId === choice.id,
            )}
            onChange={() => onResponse({ choiceId: choice.id }, true)}
          />
          <span>{choice.text}</span>
        </label>
      ))}
    </fieldset>
  );
}

export function ActivitySceneControl(props: SceneControlProps) {
  const { scene, disabled, onResponse, initialResponse } = props;
  switch (scene.component) {
    case "fraction_builder":
      return <FractionBuilder {...props} scene={scene} />;
    case "number_line":
      return <NumberLine {...props} scene={scene} />;
    case "word_tiles":
      return <WordTiles {...props} scene={scene} />;
    case "word_choice":
      return <WordChoice {...props} scene={scene} />;
    case "independent_fraction":
    case "independent_word":
      return (
        <div className="activity-independent-answer">
          <label htmlFor={`answer-${scene.id}`}>Your answer</label>
          <input
            id={`answer-${scene.id}`}
            type="text"
            name="answer"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            maxLength={100}
            defaultValue={
              typeof initialResponse === "string" ? initialResponse : ""
            }
            disabled={disabled}
            onChange={(event) =>
              onResponse(event.target.value, Boolean(event.target.value.trim()))
            }
          />
        </div>
      );
  }
}
