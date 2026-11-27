// One, None or All. Skill 8.EE.C.7-1.
// Knowing linear equations can have one solution, infinitely many, or none. Thinking 3 = 3 means x = 3 is the known slip.
Sidekick.game(Sidekick.play({
  title: "One, None or All",
  emoji: "🧮",
  premise: "Most equations have one solution. Some have none, and some are true for every number.",
  outro: "x = a: one solution. a = b (false): none. a = a (always true): every number works.",
  scene: "desk",
  kind: "sort",
  fs: 5.4,
  hint: "Simplify both sides. Do the x terms cancel? Is what remains true or false?",
  tag: "identity_as_single_solution",
  rounds: [
    { say: "How many solutions does each equation have?", bins: "One solution|No solution|All numbers", items: ["2x + 3 = 11|", "2x + 3 = 2x + 5|", "3(x + 1) = 3x + 3|"], trap: ["3(x + 1) = 3x + 3", 0], why: "Both sides are identical, so every x works. It does not mean x = 3.", win: "One, none and all." },
    { say: "Sort these.", bins: "One solution|No solution|All numbers", items: ["x + 4 = 9|5x = 2x + 6", "x + 1 = x + 2|", "2(x + 2) = 2x + 4|"], trap: ["x + 1 = x + 2", 0], why: "A number plus 1 can never equal the same number plus 2.", win: "Simplify first, then decide." },
    { say: "Sort these by yourself.", bins: "One solution|No solution|All numbers", items: ["4x − 1 = 7|", "3x + 2 = 3x − 2|x = x + 1", "5(x + 1) = 5x + 5|"], trap: ["5(x + 1) = 5x + 5", 0] },
  ],
}));
