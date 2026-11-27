// Split and Multiply. Skill 3.OA.B.5-3.
// The distributive property: 8 × 7 = 8 × 5 + 8 × 2. Multiplying only one of the parts is the known slip.
Sidekick.game(Sidekick.play({
  title: "Split and Multiply",
  emoji: "🪓",
  premise: "A hard fact can be chopped into two easy ones. Split one factor, multiply both parts, then add.",
  outro: "Break a factor into parts, multiply each part, and add the results.",
  scene: "forest",
  kind: "fill",
  cast: "",
  hint: "Both parts of the split number must be multiplied.",
  tag: "multiplies_only_one_part",
  rounds: [
    { say: "Split the 7 into 5 and 2. Finish both lines.", rows: [["8 × 7 = (8 × 5) + (8 × ___)", "2"], ["= 40 + ___", "16"]], extra: "7", trap: [1, "2"], why: "The 2 still has to be multiplied by 8. 8 × 2 is 16.", win: "40 + 16 = 56." },
    { say: "Split the 9 into 5 and 4.", rows: [["6 × 9 = (6 × 5) + (6 × ___)", "4"], ["= 30 + ___", "24"]], extra: "9", trap: [1, "4"], why: "The 4 still has to be multiplied by 6. 6 × 4 is 24.", win: "30 + 24 = 54." },
    { say: "Split and multiply by yourself.", rows: [["7 × 8 = (7 × 5) + (7 × ___)", "3"], ["= 35 + ___", "21"], ["so 7 × 8 = ___", "56"]], extra: "38 8", trap: [1, "3"] },
  ],
}));
