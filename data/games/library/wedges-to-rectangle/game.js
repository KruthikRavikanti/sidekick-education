// Wedges to Rectangle. Skill 7.G.B.4-3.
// Giving an informal derivation of the relationship between circumference and area of a circle. Memorizing the formula without meaning is the known slip.
Sidekick.game(Sidekick.play({
  title: "Wedges to Rectangle",
  emoji: "🧀",
  premise: "Cut a circle into thin wedges and line them up, tips up and tips down. They make a shape that is almost a rectangle.",
  outro: "The wedge rectangle is half the circumference long and one radius tall, so its area is πr × r.",
  scene: "kitchen",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Half the crusts are along the bottom edge. The wedge length is the radius.",
  tag: "formula_without_meaning",
  rounds: [
    { say: "The wedges make a near-rectangle. Match each part.", pic: "🔺🔻🔺🔻🔺🔻", rows: [["its base", "half the circumference"], ["its height", "the radius"], ["its area", "π × r × r"]], extra: "the diameter|", trap: [1, "the diameter"], why: "Each wedge reaches from the center to the edge. That is one radius.", win: "Base πr, height r, area πr²." },
    { say: "Now use r = 3. Match each part.", rows: [["half of the circumference 6π", "3π"], ["the height", "3"], ["base × height", "9π"]], extra: "6π", trap: [0, "6π"], why: "6π is the whole way around. Only half the crust is along the base.", win: "3π × 3 = 9π." },
    { say: "Match these by yourself.", rows: [["base", "half of 2πr"], ["height", "r"], ["base × height", "πr²"]], extra: "2πr|2r", trap: [2, "2πr"] },
  ],
}));
