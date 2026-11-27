// Solutions That Are Not Real. Skill N-CN.C.7-1.
// Solving quadratic equations with real coefficients that have complex solutions. Saying no solution is the known slip.
Sidekick.game(Sidekick.play({
  title: "Solutions That Are Not Real",
  emoji: "👻",
  premise: "x^2 = −4 has no real answer. In the complex numbers it has two: 2i and −2i.",
  outro: "A quadratic with a negative under the root still has two solutions. They are complex.",
  scene: "night",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Take the square root of the positive number and attach i. Remember both signs.",
  tag: "says_no_solution",
  rounds: [
    { say: "Solve each equation.", rows: [["x^2 + 4 = 0", "2i and −2i"], ["x^2 − 4 = 0", "2 and −2"]], extra: "no solution|", trap: [0, "no solution"], why: "No real solution, but (2i)^2 = 4i^2 = −4. So 2i works.", win: "x^2 = −4 gives ±2i." },
    { say: "Solve each equation.", rows: [["x^2 + 9 = 0", "3i and −3i"], ["x^2 + 25 = 0", "5i and −5i"], ["x^2 − 9 = 0", "3 and −3"]], extra: "9i and −9i|", trap: [0, "9i and −9i"], why: "x^2 = −9, so x is the square root of −9: 3i.", win: "Root first, then attach i." },
    { say: "Solve these by yourself.", alt: [{ rows: [["x^2 + 16 = 0", "4i and −4i"], ["x^2 + 1 = 0", "i and −i"], ["x^2 − 16 = 0", "4 and −4"]], extra: "no solution|8i and −8i", trap: [0, "no solution"] }, { rows: [["x^2 + 36 = 0", "6i and −6i"], ["x^2 + 49 = 0", "7i and −7i"], ["x^2 − 36 = 0", "6 and −6"]], extra: "no solution|18i and −18i", trap: [0, "no solution"] }] },
  ],
}));
