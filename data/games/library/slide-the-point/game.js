// Slide the Point. Skill 5.NBT.A.2-2.
// Explaining how the decimal point moves when multiplying or dividing by a power of 10. Moving the point the opposite way is the known slip.
Sidekick.game(Sidekick.play({
  title: "Slide the Point",
  emoji: "🛝",
  premise: "Multiply by 10 and the number gets bigger. Divide by 10 and it gets smaller. The decimal point shows which way.",
  outro: "Multiplying by a power of 10 makes a number bigger. Dividing makes it smaller.",
  scene: "sky",
  kind: "type",
  icon: "🛝",
  hint: "Should the answer be bigger or smaller than what you started with?",
  tag: "moves_point_the_other_way",
  rounds: [
    { say: "Key in the answer.", q: "3.2 × 10", ans: "32", trap: "0.32", why: "Multiplying by 10 makes the number bigger, not smaller.", win: "3.2 × 10 = 32." },
    { say: "Now divide.", q: "45.6 ÷ 10", ans: "4.56", trap: "456", why: "Dividing by 10 makes the number smaller.", win: "45.6 ÷ 10 = 4.56." },
    { say: "Key in the answer by yourself.", alt: [{ q: "0.75 × 100", ans: "75", trap: "0.0075" }, { q: "8.4 ÷ 100", ans: "0.084", trap: "840" }, { q: "6.03 × 10", ans: "60.3", trap: "0.603" }] },
  ],
}));
