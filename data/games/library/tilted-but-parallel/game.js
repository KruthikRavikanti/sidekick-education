// Tilted but Parallel. Skill GA-3-GSR.6.1-1.
// Parallel and perpendicular segments: tilted pairs are included so the child uses the definition. Believing such lines must be level or straight up is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tilted but Parallel",
  emoji: "🛤️",
  premise: "Parallel lines never meet, even when they lean. Perpendicular lines make a square corner, even when turned.",
  outro: "Lines can be parallel or perpendicular at any tilt.",
  scene: "paper",
  kind: "sort",
  cast: "",
  hint: "Parallel: always the same distance apart. Perpendicular: they make a square corner.",
  tag: "must_be_level_or_upright",
  rounds: [
    { say: "Sort each pair of lines.", bins: "Parallel|Perpendicular|Neither", items: ["~lines:par ~lines:par2", "~lines:perp ~lines:perp2", "~lines:x"], trap: ["~lines:par2", 2], why: "They are tilted, but they stay the same distance apart and never meet.", win: "Tilting does not change what they are." },
    { say: "Which shapes have at least one pair of parallel sides?", bins: "Has parallel sides|No parallel sides", items: ["~quad:rect ~quad:para ~quad:trap ~ngon:6", "~tri:e ~quad:kite ~ngon:5"], trap: ["~quad:para", 1], why: "Its opposite sides lean the same way and never meet.", win: "Parallel sides can lean." },
    { say: "Sort these pairs by yourself.", bins: "Parallel|Perpendicular|Neither", items: ["~lines:par2 ~lines:par", "~lines:perp2 ~lines:perp", "~lines:x ~lines:x2"], trap: ["~lines:perp2", 2] },
  ],
}));
