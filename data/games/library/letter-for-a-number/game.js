// Letter for a Number. Skill 6.EE.B.6-1.
// Using variables to represent numbers when solving real-world problems. Thinking a letter stands for an object (a = apples) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Letter for a Number",
  emoji: "🎟️",
  premise: "A variable stands for a number you do not know yet. It is not a label for an object.",
  outro: "A variable represents an unknown number: t tickets at $8 each cost 8t.",
  scene: "city",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "The letter is the NUMBER of things, not the things themselves.",
  tag: "letter_as_object",
  rounds: [
    { say: "Write an expression for each situation.", rows: [["cost of t tickets at $8 each", "8t"], ["t tickets plus a $2 fee each order", "8t + 2"]], extra: "8 tickets|", trap: [0, "8 tickets"], why: "t is a number of tickets. 8 times that number is the cost.", win: "8t, and 8t + 2." },
    { say: "Write these.", rows: [["w weeks at 5 pages a week", "5w"], ["a ribbon of length r, cut 3 off", "r − 3"], ["n friends share 12 cookies", "12 ÷ n"]], extra: "5 weeks|", trap: [0, "5 weeks"], why: "w is how many weeks. Multiply by 5 pages.", win: "Three expressions." },
    { say: "Write these by yourself.", rows: [["p pens at $2 each", "2p"], ["a height h plus 4 inches", "h + 4"], ["b bags of 6 apples", "6b"]], extra: "6 apples|2 pens", trap: [2, "6 apples"] },
  ],
}));
