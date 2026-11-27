// Share With Everyone Inside. Skill 6.EE.A.3-1.
// Applying the distributive property to generate equivalent expressions. Distributing to the first term only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Share With Everyone Inside",
  emoji: "🎁",
  premise: "The number outside the parentheses multiplies every term inside, not just the first one.",
  outro: "Distributive property: 3(2 + x) = 6 + 3x. Multiply each term inside.",
  scene: "candy",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Multiply the outside number by the first term, then by the second.",
  tag: "distributes_to_first_only",
  rounds: [
    { say: "Expand each expression.", rows: [["3(2 + x) =", "6 + 3x"], ["2(x + 5) =", "2x + 10"]], extra: "6 + x|", trap: [0, "6 + x"], why: "The 3 multiplies x too: 3 × x = 3x.", win: "Both terms were multiplied." },
    { say: "Expand these.", rows: [["4(y + 3) =", "4y + 12"], ["5(2 + a) =", "10 + 5a"], ["2(3n + 1) =", "6n + 2"]], extra: "6n + 1|", trap: [2, "6n + 1"], why: "The 2 multiplies the 1 as well.", win: "Three expansions." },
    { say: "Expand these by yourself.", rows: [["6(x + 2) =", "6x + 12"], ["3(4 + 2y) =", "12 + 6y"], ["7(a + 1) =", "7a + 7"]], extra: "6x + 2|", trap: [0, "6x + 2"] },
  ],
}));
