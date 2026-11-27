// Across the Zeros. Skill 3.NBT.A.2-2.
// Subtracting three-digit numbers with regrouping across zeros. Taking the smaller digit from the larger in each place is the known slip.
Sidekick.game(Sidekick.play({
  title: "Across the Zeros",
  emoji: "🕳️",
  premise: "A zero has nothing to lend. Reach across it to the next place, then finish the subtraction.",
  outro: "When there is a zero, trade from the next place first, then trade again.",
  scene: "desk",
  kind: "type",
  icon: "🐇",
  hint: "You cannot take from a zero. Trade a hundred for 10 tens first.",
  tag: "smaller_from_larger",
  rounds: [
    { say: "Key in the answer.", q: "532 − 217", ans: 315, trap: 325, why: "You cannot flip 2 − 7. Trade a ten: 12 − 7 is 5.", win: "532 − 217 = 315." },
    { say: "A zero is in the tens place.", q: "604 − 278", ans: 326, trap: 474, why: "Trade a hundred for 10 tens, then a ten for 10 ones.", win: "604 − 278 = 326." },
    { say: "Key in the answer by yourself.", alt: [{ q: "700 − 356", ans: 344, trap: 456 }, { q: "805 − 469", ans: 336, trap: 464 }] },
  ],
}));
