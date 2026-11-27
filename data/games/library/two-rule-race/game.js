// Two Rule Race. Skill 5.OA.B.3-1.
// Generating two numerical patterns from two given rules. Applying one rule to both patterns is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Rule Race",
  emoji: "🐇",
  premise: "The rabbit and the turtle each follow their own rule. Write the first numbers of each pattern.",
  outro: "Each rule makes its own pattern. Use the right rule for each one.",
  scene: "meadow",
  kind: "fill",
  cast: "🐇 🐢",
  hint: "Read each rule again. Start where it says and add what it says.",
  tag: "one_rule_for_both",
  rounds: [
    { say: "Match each rule to its pattern.", rows: [["A: start at 0, add 3", "0, 3, 6, 9"], ["B: start at 0, add 6", "0, 6, 12, 18"]], extra: "3, 6, 9, 12|6, 12, 18, 24", trap: [1, "0, 3, 6, 9"], why: "That is pattern A again. Pattern B adds 6 each time.", win: "Two rules, two patterns." },
    { say: "Match these.", rows: [["A: start at 1, add 2", "1, 3, 5, 7"], ["B: start at 1, add 4", "1, 5, 9, 13"]], extra: "1, 4, 8, 12|2, 4, 6, 8", trap: [1, "1, 3, 5, 7"], why: "That is pattern A again. Pattern B adds 4 each time.", win: "Each rule got its own pattern." },
    { say: "Match these by yourself.", rows: [["A: start at 0, add 5", "0, 5, 10, 15"], ["B: start at 0, add 10", "0, 10, 20, 30"], ["C: start at 2, add 5", "2, 7, 12, 17"]], extra: "5, 10, 15, 20|", trap: [1, "0, 5, 10, 15"] },
  ],
}));
