// Parallel Lines, Solve for x. Skill G-CO.C.9-2.
// Proving and using theorems about angles formed by parallel lines and a transversal. Using the converse or the other relationship by mistake is the known slip.
Sidekick.game(Sidekick.play({
  title: "Parallel Lines, Solve for x",
  emoji: "🛤️",
  premise: "With parallel lines, some angle pairs are equal and some add to 180°. Pick the right relationship before writing the equation.",
  outro: "Alternate interior and corresponding angles are equal. Same-side interior angles sum to 180°.",
  scene: "paper",
  kind: "type",
  hint: "Are the two angles on opposite sides of the crossing line, or the same side?",
  tag: "picks_other_relationship",
  rounds: [
    { say: "The lines are parallel. The marked angles are alternate interior. Key in x.", fig: { type: "transversal", mark: { "4": "2x + 10", "5": "80°" }, v: [] }, ans: 35, trap: 45, why: "Alternate interior angles are equal: 2x + 10 = 80. They do not add to 180.", win: "2x = 70, so x = 35." },
    { say: "These marked angles are on the same side, between the lines. Key in x.", fig: { type: "transversal", mark: { "4": "3x", "6": "60°" }, v: [] }, ans: 40, trap: 20, why: "Same-side interior angles add to 180°: 3x + 60 = 180.", win: "3x = 120, so x = 40." },
    { say: "Find x by yourself.", alt: [{ q: "Corresponding angles measure 4x and 100°.", ans: 25, trap: 20 }, { q: "Same-side interior angles measure 2x and 70°.", ans: 55, trap: 35 }, { q: "Alternate interior angles measure x + 15 and 65°.", ans: 50, trap: 100 }] },
  ],
}));
