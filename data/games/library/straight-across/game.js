// Straight Across. Skill 5.NF.B.4-2.
// Multiplying two fractions: 2/3 × 4/5 = 8/15. Cross-multiplying is the known slip.
Sidekick.game(Sidekick.play({
  title: "Straight Across",
  emoji: "🪜",
  premise: "To multiply two fractions, go straight across: top times top, and bottom times bottom.",
  outro: "Multiply the numerators together and the denominators together.",
  scene: "desk",
  kind: "type",
  icon: "✖️",
  hint: "Top times top is the new top number. Bottom times bottom goes on the bottom.",
  tag: "cross_multiplies",
  rounds: [
    { say: "Key in the product as a fraction.", q: "{2/3} × {4/5}", ans: "8/15", trap: "10/12", why: "Go straight across: 2 × 4 on top and 3 × 5 on the bottom.", win: "2 × 4 = 8 and 3 × 5 = 15." },
    { say: "Key in this product.", q: "{1/2} × {3/4}", ans: "3/8", trap: "4/6", why: "Go straight across: 1 × 3 on top and 2 × 4 on the bottom.", win: "Half of three fourths is three eighths." },
    { say: "Key in the product by yourself.", alt: [{ q: "{3/4} × {2/5}", ans: "6/20", trap: "15/8" }, { q: "{2/3} × {5/7}", ans: "10/21", trap: "14/15" }, { q: "{1/3} × {4/9}", ans: "4/27", trap: "9/12" }] },
  ],
}));
