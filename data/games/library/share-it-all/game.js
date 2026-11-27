// Share It All. Skill 5.NF.B.3-2.
// Solving equal-sharing problems whose answers are fractions: 5 pizzas for 4 friends is 5/4 each. Giving only the whole-number part is the known slip.
Sidekick.game(Sidekick.play({
  title: "Share It All",
  emoji: "🍕",
  premise: "When things are shared fairly, nothing is left on the table. The leftovers get cut up and shared too.",
  outro: "Sharing a things among b people gives each person a over b.",
  scene: "kitchen",
  kind: "type",
  icon: "🍕",
  hint: "Share everything. The answer is the total over the number of people.",
  tag: "ignores_the_leftover",
  rounds: [
    { say: "Key in each share as a fraction.", q: "5 pizzas are shared equally by 4 friends. How much does each friend get?", ans: "5/4", trap: "1", why: "One pizza is still left after each friend takes 1. Share that too.", win: "Each friend gets 5 fourths, or 1 and 1 fourth." },
    { say: "Key in each share.", q: "3 liters of juice are shared equally by 5 kids. How much does each kid get?", ans: "3/5", trap: "5/3", why: "There is less juice than kids, so each share is less than 1 liter.", win: "Each kid gets 3 fifths of a liter." },
    { say: "Solve it by yourself.", alt: [{ q: "7 brownies are shared equally by 2 friends. How much does each get?", ans: "7/2", trap: "3" }, { q: "9 feet of ribbon is cut into 4 equal pieces. How long is each piece?", ans: "9/4", trap: "2" }, { q: "2 pies are shared equally by 6 friends. How much does each get?", ans: "2/6", trap: "3" }] },
  ],
}));
