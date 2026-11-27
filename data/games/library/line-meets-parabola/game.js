// Line Meets Parabola. Skill A-REI.C.7-1.
// Solving a system of a linear and a quadratic equation algebraically. Finding only one intersection is the known slip.
Sidekick.game(Sidekick.play({
  title: "Line Meets Parabola",
  emoji: "🎢",
  premise: "Set a line equal to a parabola and you get a quadratic. A quadratic can have two answers, so look for two crossing points.",
  outro: "Substitute, solve the quadratic, then find y for each x. There may be 0, 1 or 2 solutions.",
  scene: "paper",
  kind: "plot",
  cast: "",
  axes: [-4, 4, -1, 7],
  quiet: true,
  hint: "A quadratic usually has two solutions. Find both x-values, then each y.",
  tag: "finds_one_intersection",
  rounds: [
    { say: "Solve y = x^2 and y = x + 2 step by step.", kind: "fill", fs: 5.2, cast: "", rows: [["set them equal", "x^2 = x + 2"], ["move everything and factor", "(x − 2)(x + 1) = 0"], ["the x-values", "2 and −1"]], extra: "2 only|", trap: [2, "2 only"], why: "Two factors, two solutions. x + 1 = 0 gives x = −1.", win: "Points (2, 4) and (−1, 1)." },
    { say: "Now tap both solutions of y = x^2 and y = x + 2 on the grid.", ans: [[2, 4], [-1, 1]], trap: [[2, 4]], why: "That is one of them. x = −1 works too: (−1)^2 = 1 and −1 + 2 = 1.", win: "(2, 4) and (−1, 1)." },
    { say: "Solve the system and tap both solutions by yourself.", alt: [{ say: "By yourself: solve y = x^2 and y = −x + 2. Tap both solutions.", ans: [[1, 1], [-2, 4]], trap: [[1, 1]] }, { say: "By yourself: solve y = x^2 and y = 4. Tap both solutions.", ans: [[2, 4], [-2, 4]], trap: [[2, 4]] }, { say: "By yourself: solve y = x^2 − 1 and y = x + 1. Tap both solutions.", ans: [[2, 3], [-1, 0]], trap: [[2, 3]] }] },
  ],
}));
