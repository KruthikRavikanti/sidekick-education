"use client";

import { useState } from "react";
import type { ActivityResponse, ActivityScene } from "@/lib/activity-types";

type SplitScene = Extract<ActivityScene, { component: "fraction_split_compare" }>;

interface SplitProps {
  scene: SplitScene;
  disabled: boolean;
  onResponse: (response: ActivityResponse, ready: boolean) => void;
  initialResponse?: ActivityResponse | null;
  showHint?: boolean;
}

function PartitionedWhole({
  numerator,
  denominator,
  factor,
  label,
  animate,
}: {
  numerator: number;
  denominator: number;
  factor: number;
  label: "Original whole" | "Split whole";
  animate: boolean;
}) {
  const total = denominator * factor;
  const shaded = numerator * factor;
  return (
    <div
      className="split-compare-whole"
      role="img"
      aria-label={`${label}: ${shaded}/${total} shaded`}
      data-partition-count={total}
      data-shaded-fraction={`${numerator}/${denominator}`}
    >
      <div
        className="split-compare-shaded"
        style={{ width: `${(100 * numerator) / denominator}%` }}
        data-testid="fraction-shaded-area"
        data-shaded-fraction={`${numerator}/${denominator}`}
        aria-hidden="true"
      />
      <div className="split-compare-original-divisions" aria-hidden="true">
        {Array.from({ length: denominator - 1 }, (_, index) => (
          <span
            className="split-compare-divider"
            key={index}
            style={{ left: `${(100 * (index + 1)) / denominator}%` }}
          />
        ))}
      </div>
      <div key={factor} className="split-compare-new-divisions" aria-hidden="true">
        {Array.from({ length: total - 1 }, (_, index) => index + 1)
          .filter((position) => position % factor !== 0)
          .map((position, index) => (
            <span
              className={`split-compare-divider split-compare-divider-new${animate ? " split-compare-divider-animate" : ""}`}
              key={position}
              style={{
                left: `${(100 * position) / total}%`,
                animationDelay: `${index * 9}ms`,
              }}
            />
          ))}
      </div>
    </div>
  );
}

export function FractionSplitCompare({
  scene,
  disabled,
  onResponse,
  initialResponse,
  showHint,
}: SplitProps) {
  const { numerator, denominator, splitFactors, wholeLabel, shadedLabel } = scene.params;
  const savedFactor =
    initialResponse &&
    typeof initialResponse === "object" &&
    "splitFactor" in initialResponse &&
    splitFactors.includes(initialResponse.splitFactor)
      ? initialResponse.splitFactor
      : 1;
  const [factor, setFactor] = useState(savedFactor);
  const [animate, setAnimate] = useState(false);
  function select(next: number) {
    setFactor(next);
    setAnimate(next !== 1);
    onResponse({ splitFactor: next }, next !== 1);
  }
  const splitNumerator = numerator * factor;
  const splitDenominator = denominator * factor;
  return (
    <section
      className={`activity-manipulative split-compare${showHint ? " activity-show-hint" : ""}`}
      aria-label="Split and compare fractions"
      data-split-factor={factor}
      data-original-numerator={numerator}
      data-original-denominator={denominator}
    >
      <div className="split-compare-setting">
        <p className="split-compare-whole-label">{wholeLabel}</p>
        <p className="split-compare-shaded-label">
          <span aria-hidden="true" />
          {shadedLabel}
        </p>
      </div>
      <figure className="split-compare-figure">
        <figcaption>
          <span>Original parts</span>
          <strong>{numerator}/{denominator}</strong>
        </figcaption>
        <PartitionedWhole
          numerator={numerator}
          denominator={denominator}
          factor={1}
          label="Original whole"
          animate={false}
        />
      </figure>
      <figure className="split-compare-figure">
        <figcaption>
          <span>Your split</span>
          <strong>{splitNumerator}/{splitDenominator}</strong>
        </figcaption>
        <PartitionedWhole
          numerator={numerator}
          denominator={denominator}
          factor={factor}
          label="Split whole"
          animate={animate}
        />
      </figure>
      <fieldset className="split-compare-controls" disabled={disabled}>
        <legend>How many equal pieces in each original part?</legend>
        <div className="split-compare-options">
          {splitFactors.map((option) => (
            <label
              className="split-compare-option"
              key={option}
              data-selected={factor === option}
            >
              <input
                type="radio"
                name={`split-${scene.id}`}
                value={option}
                aria-label={`Split each part into ${option} pieces`}
                checked={factor === option}
                onChange={() => select(option)}
              />
              <strong>{option}</strong>
              <span>equal pieces</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="split-compare-result" aria-live="polite" aria-atomic="true">
        <output aria-label="Equivalent fractions">
          {numerator}/{denominator}
          {factor > 1 ? ` = ${splitNumerator}/${splitDenominator}` : ""}
        </output>
        <p>
          {factor > 1
            ? `${numerator} shaded ${numerator === 1 ? "part became" : "parts became"} ${splitNumerator}, and ${denominator} total parts became ${splitDenominator}. The shaded amount stayed the same.`
            : "Choose a split to make smaller equal pieces without changing the shading."}
        </p>
      </div>
      {factor > 1 ? (
        <button
          className="text-button split-compare-reset"
          type="button"
          disabled={disabled}
          onClick={() => select(1)}
        >
          Start with original parts
        </button>
      ) : null}
    </section>
  );
}
