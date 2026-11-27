// Congruent or Just Similar?. Skill 8.G.A.4-1.
// Understanding that a figure is similar to another if obtained by rigid motions and dilations. Thinking similar means the same size is the known slip.
Sidekick.game(Sidekick.play({
  title: "Congruent or Just Similar?",
  emoji: "🔎",
  premise: "Similar figures have the same shape. They may be different sizes. A dilation changes size and keeps shape.",
  outro: "Rigid motions give congruent figures. Add a dilation and the figures are similar.",
  scene: "candy",
  kind: "sort",
  fs: 5,
  hint: "Was the figure enlarged or shrunk? Then it is similar but not congruent.",
  tag: "similar_means_same_size",
  rounds: [
    { say: "B was made from A. Is B congruent to A, or only similar?", bins: "Congruent|Similar only", items: ["slid 3 right|reflected, then rotated", "enlarged by 2, then rotated|shrunk by half, then slid"], trap: ["enlarged by 2, then rotated", 0], why: "Enlarging changes the size. Same shape, new size: similar.", win: "A dilation makes it similar only." },
    { say: "Is B similar to A?", bins: "Similar|Not similar", items: ["dilated by 3|dilated, then flipped|slid only", "stretched wider only|one angle changed"], trap: ["slid only", 1], why: "Congruent figures are similar too. The scale factor is 1.", win: "Stretching one way breaks the shape." },
    { say: "Sort these by yourself.", bins: "Congruent|Similar only", items: ["rotated 90°|slid, then flipped", "dilated by 3|dilated by {1/2}, then turned"], trap: ["dilated by {1/2}, then turned", 0] },
  ],
}));
