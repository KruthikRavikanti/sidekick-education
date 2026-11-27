// Percent Error. Skill 7.RP.A.3-3.
// Finding percent error. Dividing by the estimate instead of the actual value is the known slip.
Sidekick.game(Sidekick.play({
  title: "Percent Error",
  emoji: "🎯",
  premise: "Percent error tells how far off an estimate was, compared with the ACTUAL value.",
  outro: "Percent error = how far off ÷ the actual value.",
  scene: "field",
  kind: "type",
  icon: "🎯",
  unit: "%",
  hint: "Find how far off the estimate was. Divide by what actually happened.",
  tag: "divides_by_estimate",
  rounds: [
    { say: "Key in the percent error.", q: "You estimate 50 people. 40 come.", ans: 25, trap: 20, why: "That divides by the estimate. Compare with the actual 40: 10 ÷ 40.", win: "10 ÷ 40 = 25%." },
    { say: "Key in the percent error.", q: "You estimate 40 minutes. It takes 50.", ans: 20, trap: 25, why: "Divide by the actual time, 50: 10 ÷ 50.", win: "10 ÷ 50 = 20%." },
    { say: "Find the percent error by yourself.", alt: [{ q: "You guess 25 grams. The actual mass is 20 grams.", ans: 25, trap: 20 }, { q: "You guess 60 beans. There are 75.", ans: 20, trap: 25 }, { q: "You predict 100 points. The team scores 80.", ans: 25, trap: 20 }] },
  ],
}));
