// Powers Go First. Skill 6.EE.A.1-2.
// Evaluating numerical expressions involving whole-number exponents. Applying the exponent after multiplying is the known slip.
Sidekick.game(Sidekick.play({
  title: "Powers Go First",
  emoji: "⚡",
  premise: "An exponent sticks only to the number it sits on. Work out powers before you multiply or add.",
  outro: "Order: exponents first, then multiply and divide, then add and subtract.",
  scene: "night",
  kind: "type",
  icon: "⚡",
  hint: "Find the power first. It belongs only to the number right under it.",
  tag: "exponent_after_multiplying",
  rounds: [
    { say: "Key in the value.", q: "3²", ans: 9, trap: 6, why: "3² means 3 × 3, not 3 × 2.", win: "3 × 3 = 9." },
    { say: "Key in the value.", q: "2 + 3² × 4", ans: 38, trap: 146, why: "The exponent applies only to the 3. Do 3² first: 9 × 4 = 36.", win: "2 + 36 = 38." },
    { say: "Key in the value by yourself.", alt: [{ q: "5² − 3 × 4", ans: 13, trap: 88 }, { q: "4 × 2³", ans: 32, trap: 512 }, { q: "10 − 2²", ans: 6, trap: 64 }] },
  ],
}));
