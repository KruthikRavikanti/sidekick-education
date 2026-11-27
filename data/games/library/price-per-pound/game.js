// Price Per Pound. Skill 6.RP.A.2-1.
// Finding the unit rate a/b associated with a ratio a:b. Dividing in the opposite order (b/a) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Price Per Pound",
  emoji: "🍏",
  premise: "A unit rate tells how much for just ONE. Divide the amount by the number of units.",
  outro: "Unit rate = the first quantity divided by the second: dollars ÷ pounds gives dollars per pound.",
  scene: "kitchen",
  kind: "type",
  icon: "🍏",
  hint: "Per pound means for ONE pound. Divide the dollars by the pounds.",
  tag: "divides_in_reverse",
  rounds: [
    { say: "Key in the cost of one pound.", q: "12 dollars buys 4 pounds of apples.", pre: "$", ans: "3", trap: "1/3", why: "That is pounds per dollar. Cost per pound divides dollars by pounds.", win: "12 ÷ 4 = 3 dollars per pound." },
    { say: "Key in the miles for one hour.", q: "A car goes 150 miles in 3 hours.", ans: "50", trap: "1/50", why: "Miles per hour divides miles by hours.", win: "150 ÷ 3 = 50 miles per hour." },
    { say: "Key in the unit rate by yourself.", alt: [{ q: "20 dollars buys 8 notebooks. What is the cost of one notebook?", pre: "$", ans: "2.5", trap: "0.4" }, { q: "A printer makes 90 pages in 6 minutes. How many pages in one minute?", ans: "15", trap: "1/15" }, { q: "24 ounces of juice fill 4 cups. How many ounces in one cup?", ans: "6", trap: "1/6" }] },
  ],
}));
