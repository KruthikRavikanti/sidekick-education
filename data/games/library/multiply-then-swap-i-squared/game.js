// Multiply, Then Swap i Squared. Skill N-CN.A.2-2.
// Multiplying complex numbers using i² = −1. Leaving i² in the answer is the known slip.
Sidekick.game(Sidekick.play({
  title: "Multiply, Then Swap i Squared",
  emoji: "✖️",
  premise: "Multiply complex numbers like binomials. Then finish the job: every i^2 turns into −1.",
  outro: "After multiplying, replace i^2 with −1 and combine like parts.",
  scene: "space",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Find the i^2 term. Swap i^2 for −1, which flips that term’s sign.",
  tag: "leaves_i_squared",
  rounds: [
    { say: "Multiply (2 + 3i)(1 − i) step by step.", rows: [["multiply out", "2 − 2i + 3i − 3i^2"], ["−3i^2 becomes", "+ 3"], ["answer", "5 + i"]], extra: "− 3|", trap: [1, "− 3"], why: "i^2 is −1, so −3 × (−1) = +3.", win: "2 + 3 = 5, and −2i + 3i = i." },
    { say: "Multiply each pair.", rows: [["i × i", "−1"], ["3i × 2i", "−6"], ["(1 + i)(1 − i)", "2"]], extra: "6 0", trap: [1, "6"], why: "3i × 2i = 6i^2, and i^2 is −1.", win: "Every i^2 becomes −1." },
    { say: "Multiply these by yourself.", alt: [{ rows: [["2i × 5i", "−10"], ["(2 + i)(2 − i)", "5"], ["i(3 + i)", "−1 + 3i"]], extra: "10 3", trap: [0, "10"] }, { rows: [["4i × 4i", "−16"], ["(3 + i)(3 − i)", "10"], ["i(2 − i)", "1 + 2i"]], extra: "16 8", trap: [0, "16"] }] },
  ],
}));
