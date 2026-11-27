// Cross or Bounce. Skill A-APR.B.3-2.
// Using zeros to construct a rough graph of a polynomial. Ignoring multiplicity and end behavior is the known slip.
Sidekick.game(Sidekick.play({
  title: "Cross or Bounce",
  emoji: "🏀",
  premise: "At a single zero the graph cuts through the axis. At a double zero it touches and turns back, like a ball bouncing.",
  outro: "Odd multiplicity: the graph crosses. Even multiplicity: it touches and turns. The leading term sets the ends.",
  scene: "paper",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Is the factor squared? Squared factors bounce.",
  tag: "ignores_multiplicity",
  rounds: [
    { say: "y = (x + 1)(x − 2)^2. What does the graph do at each zero?", rows: [["at x = −1", "crosses the axis"], ["at x = 2", "touches and turns"]], extra: "stays away|", trap: [1, "crosses the axis"], why: "(x − 2) is squared, so the graph does not change sign there. It bounces.", win: "Cross at −1, bounce at 2." },
    { say: "How do the ends of each graph behave?", kind: "sort", fs: 5, bins: "Both ends up|Left down, right up", items: ["y = x^2|y = x^4 − 3x", "y = x^3|y = (x + 1)(x − 2)^2"], trap: ["y = (x + 1)(x − 2)^2", 0], why: "Multiplied out it starts with x^3. Odd degree: the ends go opposite ways.", win: "Even degree: same direction. Odd degree: opposite." },
    { say: "y = x^2(x − 3). Describe each zero by yourself.", rows: [["at x = 0", "touches and turns"], ["at x = 3", "crosses the axis"]], extra: "has no zero|stays above the axis", trap: [0, "crosses the axis"] },
  ],
}));
