// Round It Once. Skill 4.NBT.A.3-1.
// Rounding multi-digit numbers to any place: only the digit to the right of the target place matters. Rounding one digit at a time (double rounding) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Round It Once",
  emoji: "🛞",
  premise: "To round, look at just one digit: the one right after the place you are rounding to. Then round one time only.",
  outro: "Look at the next digit only. 5 or more rounds up. Round once, not digit by digit.",
  scene: "city",
  kind: "type",
  icon: "🛞",
  hint: "Find the place. Look at the very next digit, and no further.",
  tag: "double_rounding",
  rounds: [
    { say: "Key in the rounded number.", q: "Round 4,382 to the nearest hundred.", ans: 4400, trap: 4300, why: "The tens digit is 8. That is 5 or more, so the hundreds round up.", win: "4,382 rounds to 4,400." },
    { say: "Round one time only.", q: "Round 34,449 to the nearest thousand.", ans: 34000, trap: 35000, why: "Look only at the hundreds digit: 4. Do not round the smaller places first.", win: "34,449 rounds to 34,000." },
    { say: "Round this by yourself.", alt: [{ q: "Round 2,446 to the nearest hundred.", ans: 2400, trap: 2500 }, { q: "Round 71,499 to the nearest thousand.", ans: 71000, trap: 72000 }] },
  ],
}));
