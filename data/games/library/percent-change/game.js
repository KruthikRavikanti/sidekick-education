// Percent Change. Skill 7.RP.A.3-1.
// Solving percent increase and decrease problems. Dividing by the new amount instead of the original is the known slip.
Sidekick.game(Sidekick.play({
  title: "Percent Change",
  emoji: "📉",
  premise: "Percent change compares how much something changed with where it STARTED. Always divide by the original amount.",
  outro: "Percent change = amount of change ÷ original amount.",
  scene: "city",
  kind: "type",
  icon: "🏷️",
  unit: "%",
  hint: "Find the change. Then divide by the amount it started at.",
  tag: "divides_by_new_amount",
  rounds: [
    { say: "Key in the percent increase.", q: "A price goes from $40 to $50.", ans: 25, trap: 20, why: "That divides by the new price, 50. Use the original: 10 ÷ 40.", win: "10 ÷ 40 = 25%." },
    { say: "Key in the percent decrease.", q: "A price drops from $50 to $40.", ans: 20, trap: 25, why: "That divides by the new price, 40. Use the original: 10 ÷ 50.", win: "10 ÷ 50 = 20%." },
    { say: "Find the percent change by yourself.", alt: [{ q: "A plant grows from 20 cm to 25 cm.", ans: 25, trap: 20 }, { q: "A team shrinks from 100 players to 80.", ans: 20, trap: 25 }, { q: "A ticket rises from $60 to $75.", ans: 25, trap: 20 }] },
  ],
}));
