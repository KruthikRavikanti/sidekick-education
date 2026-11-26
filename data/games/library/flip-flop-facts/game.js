// Flip Flop Facts. Skill 1.OA.B.3-1.
// The commutative property of addition: 8 + 3 = 3 + 8. The child completes the flipped fact. Putting the total in the blank is the known slip.
Sidekick.game(Sidekick.play({
  title: "Flip Flop Facts",
  emoji: "🩴",
  premise: "Flip the two numbers in an adding fact and the total stays the same. Finish each flipped fact.",
  outro: "You can add in any order. The total does not change.",
  scene: "sand",
  kind: "fill",
  cast: "",
  hint: "Both sides have the same two numbers, just switched.",
  tag: "writes_total_in_blank",
  rounds: [
    { say: "Finish each flipped fact so both sides are the same amount.", rows: [["8 + 3 = 3 + ___", "8"], ["2 + 7 = 7 + ___", "2"]], extra: "11 9", trap: [0, "11"], why: "Both sides must be the same amount. 8 + 3 is the same as 3 + 8.", win: "8 + 3 = 3 + 8." },
    { say: "Finish these flipped facts.", rows: [["5 + 9 = ___ + 5", "9"], ["6 + 4 = 4 + ___", "6"]], extra: "14 10", trap: [0, "14"], why: "The blank is the switched number, not the total.", win: "5 + 9 = 9 + 5." },
    { say: "Finish these by yourself.", rows: [["7 + 8 = 8 + ___", "7"], ["3 + 9 = ___ + 3", "9"], ["6 + 5 = 5 + ___", "6"]], extra: "15 12", trap: [0, "15"] },
  ],
}));
