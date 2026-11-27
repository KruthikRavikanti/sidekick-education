// Half Hours and Quarters. Skill 4.MD.A.2-2.
// Measurement word problems with simple fractions or decimals. Treating every unit as if it had 100 parts (1.5 hours = 150 minutes) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Half Hours and Quarters",
  emoji: "⏳",
  premise: "Measurements often come with halves and decimals. Take care with what half of each unit really is.",
  outro: "Half an hour is 30 minutes. Half a meter is 50 centimeters. It depends on the unit.",
  scene: "desk",
  kind: "type",
  icon: "⏳",
  hint: "How many small units make one big unit? Half of that is your half.",
  tag: "converts_incorrectly",
  rounds: [
    { say: "Key in the minutes.", q: "A hike takes 1.5 hours. How many minutes is that?", ans: 90, trap: 150, why: "Half an hour is 30 minutes, not 50. An hour has 60 minutes.", win: "60 + 30 = 90 minutes." },
    { say: "Key in the total cost.", q: "You buy 3 notebooks at $1.25 each. What is the total?", pre: "$", ans: "3.75", trap: "3.25", why: "Each notebook also costs 25 cents. Three of those make 75 cents.", win: "3 × $1.25 = $3.75." },
    { say: "Solve it by yourself.", alt: [{ q: "A ribbon is 2.5 meters long. How many centimeters is that?", ans: 250, trap: 205 }, { q: "A movie lasts 2.5 hours. How many minutes is that?", ans: 150, trap: 250 }, { q: "A rope is {1/2} foot long. How many inches is that?", ans: 6, trap: 5 }] },
  ],
}));
