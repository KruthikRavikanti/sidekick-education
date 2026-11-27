// Railroad Tracks. Skill 4.G.A.1-3.
// Identifying parallel and perpendicular lines. Thinking lines must be the same length to be parallel is the known slip.
Sidekick.game(Sidekick.play({
  title: "Railroad Tracks",
  emoji: "🚂",
  premise: "Parallel lines never meet, like railroad tracks. Perpendicular lines cross at square corners.",
  outro: "Parallel lines stay the same distance apart. They do not need to be the same length.",
  scene: "field",
  kind: "sort",
  figW: 12,
  cast: "",
  hint: "Would the lines ever meet if they kept going? Do they cross at a square corner?",
  tag: "parallel_needs_same_length",
  rounds: [
    { say: "Sort each pair of lines.", bins: "Parallel|Perpendicular|Neither", items: ["~lines:par ~lines:par2", "~lines:perp", "~lines:x ~lines:x2"], trap: ["~lines:par2", 2], why: "These two are tilted, but they stay the same distance apart. They never meet.", win: "Tracks, square crossings and the rest." },
    { say: "One pair has lines of different lengths.", bins: "Parallel|Perpendicular|Neither", items: ["~lines:par3 ~lines:par", "~lines:perp2 ~lines:perp", "~lines:x"], trap: ["~lines:par3", 2], why: "Length does not matter. These two would never meet, so they are parallel.", win: "Parallel lines can be different lengths." },
    { say: "Sort these by yourself.", bins: "Parallel|Perpendicular|Neither", items: ["~lines:par3 ~lines:par2 ~lines:par", "~lines:perp2 ~lines:perp", "~lines:x2 ~lines:x"], trap: ["~lines:par3", 2] },
  ],
}));
