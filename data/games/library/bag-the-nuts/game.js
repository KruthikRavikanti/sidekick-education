// Bag the Nuts. Skill 5.NF.B.7-3.
// Word problems dividing whole numbers by unit fractions and unit fractions by whole numbers. Multiplying instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "Bag the Nuts",
  emoji: "🥜",
  premise: "How many small bags can you fill? How big is each share? Division stories with unit fractions come in both kinds.",
  outro: "Filling small containers from a big amount is division by a fraction: count how many fit.",
  scene: "kitchen",
  kind: "type",
  icon: "🥜",
  hint: "Ask: how many of the small amount fit in the big amount?",
  tag: "multiplies_instead",
  rounds: [
    { say: "Key in the number of bags.", q: "You have 3 pounds of nuts. Each bag holds {1/4} pound. How many bags can you fill?", ans: "12", trap: "3/4", why: "Each pound fills 4 bags. There are 3 pounds.", win: "3 ÷ 1 fourth = 12 bags." },
    { say: "Key in each share as a fraction.", q: "{1/2} gallon of milk is shared equally by 4 people. How much does each get?", ans: "1/8", trap: "2", why: "Each person gets less than the half gallon, not more.", win: "One half ÷ 4 = one eighth of a gallon." },
    { say: "Solve it by yourself.", alt: [{ q: "5 feet of ribbon is cut into pieces {1/3} foot long. How many pieces?", ans: "15", trap: "5/3" }, { q: "{1/4} of a pizza is shared equally by 3 kids. How much does each get?", ans: "1/12", trap: "3/4" }, { q: "2 liters of juice fills cups of {1/5} liter. How many cups?", ans: "10", trap: "2/5" }] },
  ],
}));
