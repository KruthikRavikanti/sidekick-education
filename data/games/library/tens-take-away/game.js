// Tens Take Away. Skill 1.NBT.C.6-1.
// Subtracting tens from tens: 70 − 30 is 4 tens, which is 40. Answering 4 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tens Take Away",
  emoji: "🎳",
  premise: "The pins stand in packs of ten. Knock down some packs and key in how many pins are still standing.",
  outro: "Taking tens from tens leaves tens.",
  scene: "candy",
  kind: "type",
  icon: "🎳",
  hint: "Think in tens: 7 tens take away 3 tens. Then say it as a number.",
  tag: "answers_in_ones",
  rounds: [
    { say: "Key in how many are left.", q: "70 − 30", ans: 40, trap: 4, why: "7 tens take away 3 tens is 4 tens. 4 tens is 40.", win: "70 − 30 = 40." },
    { say: "Key in how many are left.", q: "80 − 20", ans: 60, trap: 6, why: "8 tens take away 2 tens is 6 tens. 6 tens is 60.", win: "80 − 20 = 60." },
    { say: "Key in the answer by yourself.", alt: [{ q: "60 − 40", ans: 20, trap: 2 }, { q: "90 − 30", ans: 60, trap: 6 }, { q: "50 − 20", ans: 30, trap: 3 }] },
  ],
}));
