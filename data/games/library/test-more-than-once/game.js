// Test More Than Once. Skill 6.EE.A.4-1.
// Identifying when two expressions are equivalent by testing values. Testing only one value is the known slip.
Sidekick.game(Sidekick.play({
  title: "Test More Than Once",
  emoji: "🧪",
  premise: "Two expressions are equivalent if they give the same value for EVERY number. One lucky match does not prove it.",
  outro: "Equivalent expressions agree for all values. Test more than one number.",
  scene: "desk",
  kind: "sort",
  fs: 5.4,
  hint: "Try x = 1, then try another number such as x = 3.",
  tag: "tests_one_value",
  rounds: [
    { say: "Are the two expressions equivalent? Test x = 1 and x = 5.", bins: "Equivalent|Not equivalent", items: ["2(x + 3) and 2x + 6|x + x and 2x", "3x + 2 and 5x|x + 4 and 4x"], trap: ["3x + 2 and 5x", 0], why: "They match at x = 1, but at x = 5 they give 17 and 25.", win: "Two tests told them apart." },
    { say: "Test x = 2 and x = 3. Sort these.", bins: "Equivalent|Not equivalent", items: ["3(x + 1) and 3x + 3|x + x + x and 3x", "x² and 2x|x + 2 and 2x"], trap: ["x² and 2x", 0], why: "They match at x = 2, but at x = 3 they give 9 and 6.", win: "One match is not enough." },
    { say: "Sort these by yourself.", bins: "Equivalent|Not equivalent", items: ["4(x + 2) and 4x + 8|5x − 2x and 3x", "2x + 3 and 5x|x² and x + x"], trap: ["2x + 3 and 5x", 0] },
  ],
}));
