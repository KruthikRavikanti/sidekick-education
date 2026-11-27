// Times as Many. Skill 4.OA.A.1-1.
// Reading a multiplication equation as a comparison: 35 is 5 times as many as 7. Reading times as many as more than (giving 28) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Times as Many",
  emoji: "🐘",
  premise: "A multiplication fact is also a comparison. One amount is so many times as big as another.",
  outro: "35 = 5 × 7 says that 35 is 5 times as many as 7.",
  scene: "sand",
  kind: "fill",
  cast: "",
  hint: "Times as many asks how many copies of the small number make the big one.",
  tag: "times_as_many_means_more_than",
  rounds: [
    { say: "Finish each comparison.", rows: [["35 = 5 × 7, so 35 is ___ times as many as 7", "5"], ["12 = 3 × 4, so 12 is ___ times as many as 4", "3"]], extra: "28 8", trap: [0, "28"], why: "28 is how many MORE 35 is than 7. Times as many asks how many 7s make 35.", win: "35 is 5 times as many as 7." },
    { say: "Finish these comparisons.", rows: [["24 = 6 × 4, so 24 is 6 times as many as ___", "4"], ["40 = 8 × 5, so 40 is ___ times as many as 5", "8"]], extra: "20 35", trap: [1, "35"], why: "35 is how many more. Count how many 5s make 40.", win: "40 is 8 times as many as 5." },
    { say: "Finish these by yourself.", rows: [["42 = 6 × 7, so 42 is ___ times as many as 7", "6"], ["27 = 3 × 9, so 27 is 3 times as many as ___", "9"], ["20 = 5 × 4, so 20 is ___ times as many as 4", "5"]], extra: "35 16", trap: [0, "35"] },
  ],
}));
