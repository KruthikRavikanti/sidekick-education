// Quadratic Formula Steps. Skill A-REI.B.4-4.
// Solving quadratic equations with the quadratic formula. Mishandling the minus sign on b is the known slip.
Sidekick.game(Sidekick.play({
  title: "Quadratic Formula Steps",
  emoji: "🧮",
  premise: "The quadratic formula solves any quadratic. The trickiest part is −b: if b is negative, −b is positive.",
  outro: "x = (−b ± √(b² − 4ac)) ÷ 2a. Take care with the sign of b.",
  scene: "desk",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Write a, b and c first, with their signs. Then −b is the opposite of b.",
  tag: "mishandles_minus_b",
  rounds: [
    { say: "Solve 2x^2 + 3x − 2 = 0 with the formula.", rows: [["b^2 − 4ac", "25"], ["−b ± √25, over 2a", "{−3 ± 5/4}"], ["solutions", "{1/2} and −2"]], extra: "{3 ± 5/4}|", trap: [1, "{3 ± 5/4}"], why: "b is 3, so −b is −3.", win: "(−3 + 5) ÷ 4 and (−3 − 5) ÷ 4." },
    { say: "Solve x^2 − 4x + 3 = 0 with the formula.", rows: [["b^2 − 4ac", "4"], ["−b ± √4, over 2a", "{4 ± 2/2}"], ["solutions", "3 and 1"]], extra: "{−4 ± 2/2}|", trap: [1, "{−4 ± 2/2}"], why: "b is −4, so −b is +4.", win: "(4 + 2) ÷ 2 and (4 − 2) ÷ 2." },
    { say: "Solve x^2 + 2x − 8 = 0 by yourself.", rows: [["b^2 − 4ac", "36"], ["−b ± √36, over 2a", "{−2 ± 6/2}"], ["solutions", "2 and −4"]], extra: "{2 ± 6/2}|4 and −2", trap: [1, "{2 ± 6/2}"] },
  ],
}));
