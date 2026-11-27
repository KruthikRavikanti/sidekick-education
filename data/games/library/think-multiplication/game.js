// Think Multiplication. Skill 3.OA.B.6-1.
// Division as an unknown-factor problem: 32 ÷ 8 is solved by 8 × ? = 32. Subtracting instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "Think Multiplication",
  emoji: "🧠",
  premise: "Every division fact has a multiplication fact hiding inside. Use the times fact to solve it.",
  outro: "To divide, think: what times this number makes the total?",
  scene: "sky",
  kind: "fill",
  cast: "",
  hint: "What do you multiply the small number by to get the big one?",
  tag: "subtracts_instead",
  rounds: [
    { say: "Fill the times fact. Then use it to divide.", rows: [["8 × ___ = 32", "4"], ["so 32 ÷ 8 = ___", "4"]], extra: "8 24", trap: [1, "24"], why: "Use the times fact. 8 × 4 = 32, so 32 ÷ 8 is 4.", win: "8 × 4 = 32, so 32 ÷ 8 = 4." },
    { say: "Use the times fact again.", rows: [["6 × ___ = 42", "7"], ["so 42 ÷ 6 = ___", "7"]], extra: "6 36", trap: [1, "36"], why: "6 × 7 = 42, so 42 ÷ 6 is 7.", win: "6 × 7 = 42, so 42 ÷ 6 = 7." },
    { say: "Solve these by yourself.", rows: [["9 × ___ = 54", "6"], ["so 54 ÷ 9 = ___", "6"], ["7 × ___ = 56", "8"]], extra: "45 9", trap: [1, "45"] },
  ],
}));
