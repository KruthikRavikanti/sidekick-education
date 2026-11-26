// Ten Train. Skill 1.OA.B.3-2.
// Grouping addends to make ten (2 + 6 + 4 = 2 + 10): the child replaces a pair with its ten and finishes the sum.
Sidekick.game(Sidekick.play({
  title: "Ten Train",
  emoji: "🚋",
  premise: "Hook two cars together to make a ten, and the adding gets easy. Group the numbers that make ten.",
  outro: "You can group numbers in any way that helps, like making a ten.",
  scene: "city",
  kind: "fill",
  cast: "",
  hint: "Find the two numbers that make 10 and hook them together.",
  tag: "misses_the_ten",
  rounds: [
    { say: "Group the pair that makes ten. Then finish the sum.", rows: [["2 + 6 + 4 = 2 + ___", "10"], ["2 + 10 = ___", "12"]], extra: "8 16", trap: [0, "8"], why: "6 and 4 are grouped together. They make 10.", win: "2 + 10 = 12." },
    { say: "Find the ten again.", rows: [["5 + 5 + 7 = ___ + 7", "10"], ["10 + 7 = ___", "17"]], extra: "12 15", trap: [0, "12"], why: "5 and 5 are grouped together. They make 10.", win: "10 + 7 = 17." },
    { say: "Group to make ten by yourself.", rows: [["9 + 1 + 6 = ___ + 6", "10"], ["10 + 6 = ___", "16"], ["3 + 8 + 2 = 3 + ___", "10"]], extra: "15 11", trap: [1, "15"] },
  ],
}));
