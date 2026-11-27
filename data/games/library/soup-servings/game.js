// Soup Servings. Skill 6.NS.A.1-3.
// Solving word problems involving division of fractions by fractions. Multiplying instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "Soup Servings",
  emoji: "🍲",
  premise: "How many servings fit in the pot? That is a division question, even when the serving is a fraction.",
  outro: "How many of this size fit is division: total ÷ size of one.",
  scene: "kitchen",
  kind: "type",
  hint: "Ask how many of the small amount fit into the big amount.",
  tag: "multiplies_instead",
  rounds: [
    { say: "How many servings fit? Key in a number and watch them line up.", q: "How many {3/4}-cup servings are in 6 cups of soup?", view: { type: "tape", top: [6], rep: 0.75, names: ["soup", "servings"] }, ans: "8", trap: "4.5", why: "That multiplied 6 by 3 fourths. Count how many servings fit.", win: "6 ÷ 3 fourths = 8 servings." },
    { say: "How many pieces fit?", q: "A 4-yard ribbon is cut into pieces {2/3} yard long. How many pieces?", view: { type: "tape", top: [4], rep: 0.6666666666666666, names: ["ribbon", "pieces"] }, ans: "6", trap: "2.7", why: "That multiplied. Count how many pieces fit along the ribbon.", win: "4 ÷ 2 thirds = 6 pieces." },
    { say: "Solve it by yourself.", alt: [{ q: "How many {1/2}-pound bags can be filled from 7 pounds of rice?", ans: "14", trap: "3.5" }, { q: "A {3/4}-mile track is run in laps of {1/8} mile. How many laps?", ans: "6", trap: "3/32" }, { q: "How many {2/5}-liter glasses can be poured from 2 liters?", ans: "5", trap: "4/5" }] },
  ],
}));
