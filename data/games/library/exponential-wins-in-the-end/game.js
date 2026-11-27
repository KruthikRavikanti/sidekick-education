// Exponential Wins in the End. Skill F-LE.A.3-1.
// Observing that a quantity increasing exponentially eventually exceeds a quantity increasing linearly or as a polynomial. Judging from a small window only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Exponential Wins in the End",
  emoji: "🚀",
  premise: "A steep line can lead for a while. Given enough steps, a quantity that keeps multiplying always overtakes one that keeps adding.",
  outro: "An exponentially increasing quantity eventually exceeds any linear or polynomial one.",
  scene: "space",
  kind: "sort",
  fs: 6,
  hint: "Work out both values at that x. Try a bigger x too.",
  tag: "small_window_only",
  rounds: [
    { say: "f(x) = 100x and g(x) = 2^x. Which is larger at each x?", bins: "f is larger|g is larger", items: ["x = 2|x = 5|x = 9", "x = 10|x = 15|x = 20"], trap: ["x = 15", 0], why: "2^15 is 32,768. That is far more than 1,500.", win: "g takes over at x = 10 and never looks back." },
    { say: "Which one is eventually larger?", kind: "fill", fs: 5.6, cast: "", rows: [["x^2 or 2^x", "2^x"], ["1000x or (1.1)^x", "(1.1)^x"]], extra: "x^2|1000x", trap: [1, "1000x"], why: "Even a base of 1.1 keeps multiplying. In time it passes any line.", win: "The exponential wins, however slow its start." },
    { say: "f(x) = 50x and g(x) = 3^x. Sort by yourself.", bins: "f is larger|g is larger", items: ["x = 1|x = 3|x = 5", "x = 6|x = 8|x = 10"], trap: ["x = 6", 0] },
  ],
}));
