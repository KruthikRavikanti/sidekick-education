// Leftovers. Skill 4.NBT.B.6-3.
// Interpreting remainders: the remainder must be less than the divisor. A remainder larger than the divisor is the known slip.
Sidekick.game(Sidekick.play({
  title: "Leftovers",
  emoji: "🧆",
  premise: "Sometimes a few are left after sharing equally. The leftover must be too small to make another group.",
  outro: "A remainder is always smaller than the number you divide by.",
  scene: "kitchen",
  kind: "fill",
  cast: "",
  hint: "If the leftover is as big as the divisor, you can make one more group.",
  tag: "remainder_too_large",
  rounds: [
    { say: "Fill in each division.", rows: [["17 ÷ 5 = 3 remainder ___", "2"], ["22 ÷ 4 = ___ remainder 2", "5"]], extra: "7 4", trap: [0, "7"], why: "A leftover of 7 is big enough to make another group of 5.", win: "3 remainder 2, and 5 remainder 2." },
    { say: "Fill in these.", rows: [["125 ÷ 4 = ___ remainder 1", "31"], ["26 ÷ 4 = 6 remainder ___", "2"]], extra: "30 6", trap: [1, "6"], why: "A leftover of 6 is big enough to make another group of 4.", win: "31 remainder 1, and 6 remainder 2." },
    { say: "Fill these by yourself.", rows: [["47 ÷ 6 = 7 remainder ___", "5"], ["58 ÷ 7 = ___ remainder 2", "8"], ["35 ÷ 8 = 4 remainder ___", "3"]], extra: "11 9", trap: [0, "11"] },
  ],
}));
