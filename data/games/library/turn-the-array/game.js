// Turn the Array. Skill 3.OA.B.5-1.
// The commutative property of multiplication: 6 × 4 = 4 × 6. Writing the product in the blank is the known slip.
Sidekick.game(Sidekick.play({
  title: "Turn the Array",
  emoji: "🔃",
  premise: "Turn an array on its side and the rows become columns, but nothing is added or lost.",
  outro: "You can multiply in either order. The product is the same.",
  scene: "candy",
  kind: "fill",
  cast: "",
  hint: "Both sides use the same two numbers, just switched.",
  tag: "writes_product_in_blank",
  rounds: [
    { say: "Finish each turned fact.", rows: [["6 × 4 = 4 × ___", "6"], ["3 × 9 = ___ × 3", "9"]], extra: "24 27", trap: [0, "24"], why: "The blank is the switched factor, not the product.", win: "6 × 4 = 4 × 6." },
    { say: "Finish these turned facts.", rows: [["7 × 5 = 5 × ___", "7"], ["8 × 2 = ___ × 8", "2"]], extra: "35 16", trap: [0, "35"], why: "The blank is the switched factor, not the product.", win: "7 × 5 = 5 × 7." },
    { say: "Finish these by yourself.", rows: [["9 × 4 = 4 × ___", "9"], ["6 × 7 = ___ × 6", "7"], ["3 × 8 = 8 × ___", "3"]], extra: "36 42 24", trap: [0, "36"] },
  ],
}));
