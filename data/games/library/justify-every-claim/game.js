// Justify Every Claim. Skill G-SRT.B.5-2.
// Using congruence and similarity criteria for triangles to prove relationships in geometric figures. Skipping the justification is the known slip.
Sidekick.game(Sidekick.play({
  title: "Justify Every Claim",
  emoji: "⚖️",
  premise: "In a proof, a picture that looks right proves nothing. Each claim needs a named reason: a shared side, a criterion, matching parts.",
  outro: "Use congruence and similarity criteria, with a reason for every step, to prove relationships in figures.",
  scene: "paper",
  kind: "sort",
  fs: 4.6,
  hint: "Is there a named criterion (SSS, SAS, ASA), or just the look of the picture?",
  tag: "skips_justification",
  rounds: [
    { say: "Is each one enough to prove two triangles congruent?", bins: "Enough|Not enough", items: ["three pairs of equal sides (SSS)|two equal sides and the angle between (SAS)", "two pairs of equal sides only|they look the same in the diagram"], trap: ["they look the same in the diagram", 0], why: "A diagram can mislead. A proof needs a criterion.", win: "Name the criterion." },
    { say: "Triangles ABD and CBD share side BD. AB = CB and angle ABD = angle CBD. Give each reason.", kind: "fill", fs: 4.8, cast: "", rows: [["BD = BD", "shared side"], ["the triangles are congruent by", "SAS"], ["so AD = CD because", "matching parts are equal"]], extra: "it looks that way|", trap: [2, "it looks that way"], why: "Once the triangles are proved congruent, their matching sides must be equal.", win: "Three steps, three reasons." },
    { say: "Sort these by yourself.", bins: "Enough|Not enough", items: ["two angles and the side between match (ASA)|all three sides match (SSS)", "one side and one angle match|the picture is drawn to scale"], trap: ["the picture is drawn to scale", 0] },
  ],
}));
