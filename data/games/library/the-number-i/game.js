// The Number i. Skill N-CN.A.1-1.
// Knowing there is a complex number i with i² = −1. Thinking i² = 1 is the known slip.
Sidekick.game(Sidekick.play({
  title: "The Number i",
  emoji: "🌀",
  premise: "No real number squares to a negative. So mathematicians named a new one: i, the number whose square is −1.",
  outro: "i^2 = −1. The powers of i cycle: i, −1, −i, 1.",
  scene: "space",
  kind: "type",
  icon: "🌀",
  hint: "i was invented so that i × i = −1.",
  tag: "i_squared_is_one",
  rounds: [
    { say: "Key in i^2. Use the ± key for a negative.", q: "i × i = ?", ans: -1, trap: 1, why: "i is defined so that its square is negative one.", win: "i^2 = −1." },
    { say: "Each power multiplies by i again. Match them.", kind: "fill", fs: 6, cast: "", rows: [["i^2", "−1"], ["i^3", "−i"], ["i^4", "1"]], extra: "i", trap: [2, "−1"], why: "i^4 is i^2 × i^2 = (−1)(−1) = 1.", win: "i, −1, −i, 1, and the cycle repeats." },
    { say: "Match the powers of i by yourself.", kind: "fill", fs: 6, cast: "", rows: [["i^2", "−1"], ["i^3", "−i"], ["i^4", "1"], ["i^5", "i"]], extra: "0", trap: [0, "1"] },
  ],
}));
