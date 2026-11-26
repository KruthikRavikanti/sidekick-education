// Think Addition. Skill 1.OA.B.4-1.
// Subtraction as an unknown-addend problem: 10 − 8 is solved by 8 + ? = 10. The child fills both facts and sees they share the same number.
Sidekick.game(Sidekick.play({
  title: "Think Addition",
  emoji: "💭",
  premise: "A taking-away fact is an adding fact in disguise. Use the adding fact to solve its partner.",
  outro: "To take away, think: what do I add to get there?",
  scene: "sky",
  kind: "fill",
  cast: "",
  hint: "What do you add to the small number to reach the big one?",
  tag: "does_not_use_related_fact",
  rounds: [
    { say: "Fill the adding fact. Then use it for the take-away fact.", rows: [["8 + ___ = 10", "2"], ["so 10 − 8 = ___", "2"]], extra: "8 18", trap: [1, "8"], why: "Use the adding fact. 8 and 2 make 10, so 10 take away 8 is 2.", win: "8 + 2 = 10, so 10 − 8 = 2." },
    { say: "Use the adding fact again.", rows: [["7 + ___ = 12", "5"], ["so 12 − 7 = ___", "5"]], extra: "7 19", trap: [1, "7"], why: "7 and 5 make 12, so 12 take away 7 is 5.", win: "7 + 5 = 12, so 12 − 7 = 5." },
    { say: "Solve these by yourself.", rows: [["9 + ___ = 15", "6"], ["so 15 − 9 = ___", "6"], ["6 + ___ = 13", "7"]], extra: "9 8", trap: [1, "9"] },
  ],
}));
