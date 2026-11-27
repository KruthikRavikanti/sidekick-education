// Which Shortcuts Work?. Skill G-CO.B.8-1.
// Explaining how the criteria for triangle congruence (ASA, SAS, SSS) follow from rigid motions. Thinking SSA or AAA proves congruence is the known slip.
Sidekick.game(Sidekick.play({
  title: "Which Shortcuts Work?",
  emoji: "✅",
  premise: "You do not need all six parts to prove triangles congruent. Three well-chosen parts will do, but not just any three.",
  outro: "SSS, SAS and ASA prove congruence. AAA and SSA do not.",
  scene: "paper",
  kind: "sort",
  fs: 6,
  hint: "Could two different triangles share those three parts?",
  tag: "ssa_or_aaa",
  rounds: [
    { say: "Which sets of matching parts prove two triangles congruent?", bins: "Proves it|Does not", items: ["SSS|SAS|ASA", "AAA|SSA"], trap: ["AAA", 0], why: "Equal angles fix the shape, not the size. A small and a large triangle can share them.", win: "Three that work, two that do not." },
    { say: "Name each shortcut.", kind: "fill", fs: 5.2, cast: "", rows: [["three pairs of equal sides", "SSS"], ["two sides and the angle between them", "SAS"], ["two angles and the side between them", "ASA"]], extra: "AAA", trap: [1, "SSS"], why: "There is an angle in it, and it sits between the two sides.", win: "The middle letter is the part in between." },
    { say: "Sort these by yourself.", fs: 4.8, bins: "Proves it|Does not", items: ["all three sides match|two sides and the angle between|two angles and the side between", "all three angles match|two sides and an angle not between"], trap: ["all three angles match", 0] },
  ],
}));
