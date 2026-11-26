// Zero Bridge. Skill 2.NBT.B.7-2.
// Subtracting three-digit numbers with decomposing, including across a zero: 403 − 156. Taking the smaller digit from the larger in each place is the known slip.
Sidekick.game(Sidekick.play({
  title: "Zero Bridge",
  emoji: "🌁",
  premise: "There is a zero in the way and nothing to trade from. Reach across to the hundreds, then key in the answer.",
  outro: "When a place has zero, trade from the next place over first.",
  scene: "city",
  kind: "type",
  icon: "🌉",
  hint: "No tens to trade? Trade a hundred for 10 tens first.",
  tag: "smaller_from_larger",
  rounds: [
    { say: "Key in the answer.", q: "352 − 127", ans: 225, trap: 235, why: "You cannot flip 2 − 7. Trade a ten: 12 − 7 is 5.", win: "352 − 127 = 225." },
    { say: "A zero is in the way. Trade from the hundreds.", q: "403 − 156", ans: 247, trap: 353, why: "Trade a hundred for 10 tens, then a ten for 10 ones.", win: "403 − 156 = 247." },
    { say: "Key in the answer by yourself.", alt: [{ q: "502 − 248", ans: 254, trap: 346 }, { q: "600 − 375", ans: 225, trap: 375 }] },
  ],
}));
