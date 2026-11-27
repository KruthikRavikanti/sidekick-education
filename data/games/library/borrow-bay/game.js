// Borrow Bay. Skill 2.NBT.B.5-2.
// Subtracting two-digit numbers by place value: 52 − 37 needs a ten broken into ones. Taking the smaller digit from the larger in each place (giving 25) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Borrow Bay",
  emoji: "⛵",
  premise: "Sometimes there are not enough ones to take away. Break a ten into ones first, then key in the answer.",
  outro: "When the ones are too few, trade one ten for ten ones.",
  scene: "ocean",
  kind: "type",
  icon: "⛵",
  hint: "You cannot take 7 ones from 2 ones. Trade a ten for 10 ones.",
  tag: "smaller_from_larger",
  rounds: [
    { say: "Key in the answer.", q: "52 − 37", ans: 15, trap: 25, why: "You cannot flip 2 − 7 into 7 − 2. Trade a ten: 12 − 7 is 5.", win: "52 − 37 = 15." },
    { say: "Trade a ten again.", q: "61 − 28", ans: 33, trap: 47, why: "Trade a ten for ones: 11 − 8 is 3. Then 5 tens − 2 tens.", win: "61 − 28 = 33." },
    { say: "Key in the answer by yourself.", alt: [{ q: "73 − 46", ans: 27, trap: 33 }, { q: "84 − 59", ans: 25, trap: 35 }] },
  ],
}));
