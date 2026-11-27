// Find the Whole. Skill 6.RP.A.3-5.
// Finding the whole, given a part and the percent. Multiplying by the percent when division is needed is the known slip.
Sidekick.game(Sidekick.play({
  title: "Find the Whole",
  emoji: "🧩",
  premise: "Sometimes you know the part and the percent, and the whole is hidden. Work backward to find it.",
  outro: "Whole = part ÷ percent. If 15 is 30%, then 10% is 5 and 100% is 50.",
  scene: "desk",
  kind: "type",
  icon: "🧩",
  hint: "Find what 10% is. Then multiply by 10 for the whole.",
  tag: "multiplies_by_percent",
  rounds: [
    { say: "Key in the whole.", q: "15 is 30% of what number?", ans: "50", trap: "4.5", why: "That takes 30% of 15. The whole must be bigger than 15.", win: "30% is 15, so 10% is 5 and 100% is 50." },
    { say: "Key in the whole.", q: "12 is 25% of what number?", ans: "48", trap: "3", why: "That takes 25% of 12. If 12 is one quarter, the whole is four of them.", win: "12 × 4 = 48." },
    { say: "Key in the whole by yourself.", alt: [{ q: "18 is 60% of what number?", ans: "30", trap: "10.8" }, { q: "9 is 20% of what number?", ans: "45", trap: "1.8" }, { q: "35 is 70% of what number?", ans: "50", trap: "24.5" }] },
  ],
}));
