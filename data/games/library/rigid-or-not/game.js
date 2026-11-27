// Rigid or Not?. Skill G-CO.A.2-2.
// Comparing transformations that preserve distance and angle to those that do not. Thinking dilations preserve distance is the known slip.
Sidekick.game(Sidekick.play({
  title: "Rigid or Not?",
  emoji: "📏",
  premise: "Rigid motions move a figure without changing any length or angle. Dilations and stretches change lengths.",
  outro: "Translations, rotations and reflections preserve distance and angle. Dilations do not preserve distance.",
  scene: "paper",
  kind: "sort",
  fs: 5.4,
  hint: "After the move, is every length the same as before?",
  tag: "dilation_preserves_distance",
  rounds: [
    { say: "Does each transformation keep all distances the same?", bins: "Keeps distances|Changes distances", items: ["rotation by 90°|reflection over a line|translation", "dilation by 2|horizontal stretch"], trap: ["dilation by 2", 0], why: "A dilation by 2 doubles every length. Angles stay, distances do not.", win: "Three rigid motions." },
    { say: "Sort the rules.", bins: "Keeps distances|Changes distances", items: ["(x, y) → (x + 5, y)|(x, y) → (−x, y)|(x, y) → (y, −x)", "(x, y) → (3x, 3y)|(x, y) → (2x, y)"], trap: ["(x, y) → (3x, 3y)", 0], why: "Multiplying both coordinates by 3 triples every distance.", win: "Adding and flipping are rigid. Multiplying is not." },
    { say: "Sort these by yourself.", bins: "Keeps distances|Changes distances", items: ["slide up 4|turn 180° about a point|flip over the x-axis", "enlarge by 3|shrink to half size"], trap: ["shrink to half size", 0] },
  ],
}));
