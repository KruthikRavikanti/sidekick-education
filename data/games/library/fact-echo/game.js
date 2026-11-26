// Fact Echo. Skill 1.NBT.C.6-2.
// Relating tens subtraction to single-digit facts: 8 − 5 = 3, so 80 − 50 = 30. Giving the ones answer for the tens fact is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fact Echo",
  emoji: "📣",
  premise: "Shout a small fact into the canyon and it echoes back in tens. Use the little fact to find the big one.",
  outro: "A fact about ones helps with the same fact about tens.",
  scene: "sky",
  kind: "fill",
  cast: "",
  hint: "The tens fact is the same as the small fact, in tens.",
  tag: "answers_in_ones",
  rounds: [
    { say: "Use the small fact to finish the big one.", rows: [["8 − 5 = 3, so 80 − 50 = ___", "30"], ["7 − 3 = 4, so 70 − 30 = ___", "40"]], extra: "3 4", trap: [0, "3"], why: "8 tens take away 5 tens is 3 tens. That is 30.", win: "30 and 40." },
    { say: "First the small fact, then its echo.", rows: [["9 − 4 = ___", "5"], ["so 90 − 40 = ___", "50"]], extra: "500 14", trap: [1, "5"], why: "9 tens take away 4 tens is 5 tens. That is 50.", win: "9 − 4 = 5, so 90 − 40 = 50." },
    { say: "Finish these by yourself.", rows: [["6 − 2 = 4, so 60 − 20 = ___", "40"], ["9 − 6 = 3, so 90 − 60 = ___", "30"], ["5 − 1 = 4, so 50 − 10 = ___", "40"]], extra: "4 3", trap: [0, "4"] },
  ],
}));
