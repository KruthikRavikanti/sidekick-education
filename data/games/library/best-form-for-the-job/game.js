// Best Form for the Job. Skill 7.EE.A.2-2.
// Choosing a form of an expression that answers the question at hand. Rewriting without a purpose is the known slip.
Sidekick.game(Sidekick.play({
  title: "Best Form for the Job",
  emoji: "🧰",
  premise: "Two equivalent expressions can tell different stories. Pick the form that shows what the question asks about.",
  outro: "Equivalent forms highlight different things. Choose the one that fits the question.",
  scene: "desk",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Read what the form should SHOW. Which expression looks like that sentence?",
  tag: "rewrites_without_purpose",
  rounds: [
    { say: "A rectangle has perimeter 2l + 2w. Match each description.", rows: [["double the sum of length and width", "2(l + w)"], ["two lengths plus two widths", "2l + 2w"]], extra: "l + w|", trap: [0, "l + w"], why: "That is only halfway around. Double it.", win: "Same perimeter, two views." },
    { say: "A price p is 20% off. Match each description.", rows: [["the sale price in one step", "0.8p"], ["the price minus the amount taken off", "p − 0.2p"]], extra: "0.2p|", trap: [0, "0.2p"], why: "0.2p is the discount, not the sale price.", win: "Both equal the sale price." },
    { say: "Match these by yourself.", rows: [["3 equal groups of x + 4", "3(x + 4)"], ["3 x-tiles and 12 unit tiles", "3x + 12"]], extra: "x + 12|3x + 4", trap: [0, "3x + 4"] },
  ],
}));
