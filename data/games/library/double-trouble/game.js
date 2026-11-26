// Double Trouble. Skill 1.OA.C.6-3.
// Doubles and near doubles (6 + 7 = 6 + 6 + 1): the child uses the smaller double and adds one. Adding one to the bigger double is the known slip.
Sidekick.game(Sidekick.play({
  title: "Double Trouble",
  emoji: "👯",
  premise: "If you know a double, the fact next door is just one more. Use the doubles to find their neighbors.",
  outro: "A near double is a double plus one more.",
  scene: "candy",
  kind: "fill",
  cast: "",
  hint: "Use the double of the smaller number, then add 1.",
  tag: "uses_the_bigger_double",
  rounds: [
    { say: "Use the double to find its neighbor.", rows: [["6 + 6 = ___", "12"], ["6 + 7 = 6 + 6 + 1 = ___", "13"]], extra: "14 15", trap: [1, "15"], why: "6 + 7 is one more than 6 + 6, not one more than 7 + 7.", win: "6 + 6 = 12, so 6 + 7 = 13." },
    { say: "Another double and its neighbor.", rows: [["8 + 8 = ___", "16"], ["8 + 9 = 8 + 8 + 1 = ___", "17"]], extra: "18 19", trap: [1, "19"], why: "8 + 9 is one more than 8 + 8.", win: "8 + 8 = 16, so 8 + 9 = 17." },
    { say: "Use doubles by yourself.", rows: [["7 + 7 = ___", "14"], ["7 + 8 = ___", "15"], ["5 + 6 = ___", "11"]], extra: "16 17 13", trap: [1, "17"] },
  ],
}));
