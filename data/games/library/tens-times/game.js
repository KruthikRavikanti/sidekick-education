// Tens Times. Skill 3.NBT.A.3-1.
// Multiplying a one-digit number by a multiple of ten: 9 × 80 is 9 × 8 tens, which is 72 tens or 720. Stopping at 72 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tens Times",
  emoji: "✖️",
  premise: "Multiplying by 80 is really multiplying by 8 tens. Count in tens and the big fact gets small.",
  outro: "To multiply by a multiple of ten, multiply the tens, then say how many tens that is.",
  scene: "candy",
  kind: "fill",
  cast: "",
  hint: "72 tens is not 72. How much is 72 tens?",
  tag: "forgets_the_tens",
  rounds: [
    { say: "Think in tens. Finish both lines.", rows: [["9 × 80 = 9 × 8 ___", "tens"], ["= 72 tens = ___", "720"]], extra: "ones 72", trap: [1, "72"], why: "72 tens is 720, not 72.", win: "9 × 80 = 720." },
    { say: "Think in tens again.", rows: [["6 × 40 = 6 × 4 ___", "tens"], ["= 24 tens = ___", "240"]], extra: "ones 24", trap: [1, "24"], why: "24 tens is 240, not 24.", win: "6 × 40 = 240." },
    { say: "Finish these by yourself.", rows: [["7 × 30 = 7 × 3 tens = ___ tens", "21"], ["21 tens = ___", "210"], ["5 × 60 = ___", "300"]], extra: "30 2100", trap: [2, "30"] },
  ],
}));
