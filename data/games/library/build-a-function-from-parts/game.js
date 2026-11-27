// Build a Function From Parts. Skill F-BF.A.1-2.
// Combining standard function types using arithmetic operations. Adding unrelated quantities is the known slip.
Sidekick.game(Sidekick.play({
  title: "Build a Function From Parts",
  emoji: "🧱",
  premise: "Functions can be added, subtracted and multiplied like numbers. Profit is revenue minus cost.",
  outro: "Combine standard function types using arithmetic operations, keeping units consistent.",
  scene: "city",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Write both functions out, then combine like terms.",
  tag: "adds_unrelated_quantities",
  rounds: [
    { say: "Revenue is f(x) = 20x. Cost is g(x) = 5x + 100. Match each combination.", rows: [["profit: (f − g)(x)", "15x − 100"], ["(f + g)(x)", "25x + 100"]], extra: "15x + 100|", trap: [0, "15x + 100"], why: "Subtract the whole cost: 20x − 5x − 100.", win: "Profit is revenue minus all of the cost." },
    { say: "A hot drink cools toward a 70° room. Match each model.", rows: [["room temperature plus a decaying part", "70 + 110(0.9)^t"], ["the temperature at t = 0", "180"]], extra: "180(0.9)^t|70", trap: [0, "180(0.9)^t"], why: "That would decay all the way to 0. The drink stops at room temperature, 70.", win: "A constant plus an exponential." },
    { say: "f(x) = x^2 and g(x) = 3x. Match by yourself.", rows: [["(f + g)(x)", "x^2 + 3x"], ["(f − g)(x)", "x^2 − 3x"], ["(f × g)(x)", "3x^3"]], extra: "3x^2|", trap: [2, "3x^2"] },
  ],
}));
