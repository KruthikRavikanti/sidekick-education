// Grow or Shrink. Skill GA-1-PAR.3.2-1.
// Describing how a pattern grows or shrinks: the child matches each number pattern to its rule. Seeing every pattern as repeating is the known slip.
Sidekick.game(Sidekick.play({
  title: "Grow or Shrink",
  emoji: "🌱",
  premise: "Some patterns grow, some shrink and some just repeat. Give each number pattern its rule.",
  outro: "A growing pattern adds the same amount each time. A shrinking pattern takes the same amount away.",
  scene: "meadow",
  kind: "fill",
  cast: "",
  hint: "Look from one number to the next. What happened each time?",
  tag: "sees_only_repeating",
  rounds: [
    { say: "Drag the rule that fits each pattern.", rows: [["2, 4, 6, 8", "add 2"], ["10, 9, 8, 7", "take away 1"]], extra: "it repeats|add 1", trap: [0, "it repeats"], why: "The numbers keep getting bigger by 2. They never start over.", win: "Add 2, and take away 1." },
    { say: "Three patterns. One really does repeat.", rows: [["5, 10, 15, 20", "add 5"], ["20, 18, 16, 14", "take away 2"], ["1, 2, 1, 2", "it repeats"]], extra: "add 2|", trap: [1, "add 2"], why: "These numbers are getting smaller, by 2 each time.", win: "Growing, shrinking and repeating." },
    { say: "Match the rules by yourself.", rows: [["3, 6, 9, 12", "add 3"], ["50, 40, 30, 20", "take away 10"], ["7, 8, 9, 10", "add 1"]], extra: "it repeats|add 10", trap: [1, "add 10"] },
  ],
}));
