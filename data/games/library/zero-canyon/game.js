// Zero Canyon. Skill 4.NBT.B.4-2.
// Subtracting multi-digit numbers across zeros. Taking the smaller digit from the larger in each place is the known slip.
Sidekick.game(Sidekick.play({
  title: "Zero Canyon",
  emoji: "🏜️",
  premise: "A row of zeros stretches across the number like a canyon. Trade your way across it, one place at a time.",
  outro: "To subtract across zeros, trade from the first place that has something to give.",
  scene: "sand",
  kind: "type",
  icon: "🤠",
  hint: "Find the nearest place that is not zero and trade from there, step by step.",
  tag: "smaller_from_larger",
  rounds: [
    { say: "Key in the answer.", q: "5,002 − 1,847", ans: 3155, trap: 4845, why: "You cannot flip the digits. Trade from the thousands across the zeros.", win: "5,002 − 1,847 = 3,155." },
    { say: "A wider canyon.", q: "60,005 − 23,478", ans: 36527, trap: 43473, why: "Trade from the ten thousands, across three zeros, to the ones.", win: "60,005 − 23,478 = 36,527." },
    { say: "Key in the answer by yourself.", alt: [{ q: "70,003 − 26,548", ans: 43455, trap: 56545 }, { q: "9,000 − 3,762", ans: 5238, trap: 6762 }] },
  ],
}));
