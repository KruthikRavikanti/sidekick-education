// Rule Finder. Skill GA-2-PAR.4.1-2.
// Explaining the rule of a number pattern: the rule must hold between every pair of terms. A rule that fits only part of the pattern is the known slip.
Sidekick.game(Sidekick.play({
  title: "Rule Finder",
  emoji: "🧪",
  premise: "Each number pattern follows one rule from start to finish. Test the rule on every step, not just the last one.",
  outro: "A pattern rule has to work for every step.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "Check the jump between each pair of numbers. Is it always the same?",
  tag: "rule_fits_one_step",
  rounds: [
    { say: "Drag the rule that works for the whole pattern.", rows: [["3, 7, 11, 15", "add 4"], ["40, 35, 30, 25", "subtract 5"]], extra: "add 3|", trap: [0, "add 3"], why: "From 3 to 7 is 4. From 7 to 11 is 4. The rule is add 4.", win: "Add 4 and subtract 5." },
    { say: "Find each rule.", rows: [["2, 12, 22, 32", "add 10"], ["50, 44, 38, 32", "subtract 6"], ["5, 8, 11, 14", "add 3"]], extra: "add 2|", trap: [2, "add 2"], why: "From 5 to 8 is 3, every time.", win: "Three patterns, three rules." },
    { say: "Find the rules by yourself.", rows: [["4, 9, 14, 19", "add 5"], ["60, 52, 44, 36", "subtract 8"], ["1, 8, 15, 22", "add 7"]], extra: "add 4|subtract 6", trap: [1, "subtract 6"] },
  ],
}));
