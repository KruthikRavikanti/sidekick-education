// Like Terms Only. Skill 6.EE.A.3-2.
// Combining like terms to generate equivalent expressions. Adding unlike terms (3x + 2 = 5x) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Like Terms Only",
  emoji: "🍎",
  premise: "You can add apples to apples. Terms with the same variable combine. A plain number and an x term do not.",
  outro: "Only like terms combine: 3x + 2x = 5x, but 3x + 2 stays as it is.",
  scene: "kitchen",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Do both terms have the same letter part?",
  tag: "adds_unlike_terms",
  rounds: [
    { say: "Simplify each expression.", rows: [["y + y + y =", "3y"], ["3x + 2x =", "5x"], ["3x + 2 =", "stays 3x + 2"]], extra: "y³", trap: [2, "5x"], why: "2 has no x. Unlike terms cannot be added together.", win: "Only like terms combined." },
    { say: "Simplify these.", rows: [["4a + a =", "5a"], ["6n − 2n =", "4n"], ["7 + 2b =", "stays 7 + 2b"]], extra: "9b", trap: [2, "9b"], why: "7 is a plain number and 2b has a letter. They stay apart.", win: "Like terms only." },
    { say: "Simplify these by yourself.", rows: [["2x + 3x + x =", "6x"], ["5y + 4 =", "stays 5y + 4"], ["8m − 3m =", "5m"]], extra: "9y", trap: [1, "9y"] },
  ],
}));
