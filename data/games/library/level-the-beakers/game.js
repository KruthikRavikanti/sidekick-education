// Level the Beakers. Skill 5.MD.B.2-2.
// Using operations on line plot data: redistributing the total equally among the containers. Not being able to redistribute equally is the known slip.
Sidekick.game(Sidekick.play({
  title: "Level the Beakers",
  emoji: "🧫",
  premise: "Pour all the beakers together, then share the liquid out again so every beaker holds the same amount.",
  outro: "To share equally: add up the total, then divide by the number of containers.",
  scene: "desk",
  kind: "type",
  icon: "🧫",
  hint: "First find the total. Then split it evenly.",
  tag: "cannot_share_equally",
  rounds: [
    { say: "Four beakers hold {1/4}, {1/4}, {1/2} and 1 cup. Work out the fair share.", kind: "fill", cast: "", rows: [["Total: {1/4} + {1/4} + {1/2} + 1 =", "2 cups"], ["Shared by 4 beakers: 2 ÷ 4 =", "{1/2} cup"]], extra: "1 cup|4 cups", trap: [1, "1 cup"], why: "2 cups shared by 4 beakers is less than 1 cup each.", win: "Each beaker gets half a cup." },
    { say: "Key in how much each jar gets.", q: "Three jars hold {1/2}, {1/2} and 2 liters. The liquid is shared equally among the 3 jars.", ans: "1", trap: "3", why: "3 liters is the total. Now share it among 3 jars.", win: "3 liters ÷ 3 jars = 1 liter each." },
    { say: "Solve it by yourself. Key in a fraction.", alt: [{ q: "Four cups hold {1/8}, {3/8}, {1/2} and 1 cup. The liquid is shared equally. How much is in each cup?", ans: "1/2", trap: "2" }, { q: "Two beakers hold {1/4} and {3/4} liter. The liquid is shared equally. How much is in each beaker?", ans: "1/2", trap: "1" }] },
  ],
}));
