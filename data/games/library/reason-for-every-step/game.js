// Reason for Every Step. Skill A-REI.A.1-1.
// Explaining each step in solving a simple equation as following from the equality asserted at the previous step. Not being able to say why a step is allowed is the known slip.
Sidekick.game(Sidekick.play({
  title: "Reason for Every Step",
  emoji: "🪜",
  premise: "Each step in solving an equation is allowed for a reason. Whatever you do to one side, you do to the other.",
  outro: "Justify each step with a property: add, subtract, multiply or divide both sides by the same thing.",
  scene: "desk",
  kind: "fill",
  fs: 5,
  cast: "",
  hint: "What was done to BOTH sides to get from one line to the next?",
  tag: "cannot_justify_step",
  rounds: [
    { say: "Solving 3x + 2 = 14. Give the reason for each step.", rows: [["3x + 2 = 14 becomes 3x = 12", "subtract 2 from both sides"], ["3x = 12 becomes x = 4", "divide both sides by 3"]], extra: "add 2 to one side|", trap: [0, "add 2 to one side"], why: "Changing only one side breaks the balance. Both sides lost 2.", win: "Both sides, same operation." },
    { say: "Solving 2(x + 1) = 10. Give the reason for each step.", rows: [["2(x + 1) = 10 becomes 2x + 2 = 10", "distributive property"], ["2x + 2 = 10 becomes 2x = 8", "subtract 2 from both sides"], ["2x = 8 becomes x = 4", "divide both sides by 2"]], trap: [0, "divide both sides by 2"], why: "Nothing was divided yet. The 2 was multiplied through the bracket.", win: "Three steps, three reasons." },
    { say: "Solving {x/3} − 1 = 4. Give the reasons by yourself.", rows: [["{x/3} − 1 = 4 becomes {x/3} = 5", "add 1 to both sides"], ["{x/3} = 5 becomes x = 15", "multiply both sides by 3"]], extra: "subtract 1 from both sides|divide both sides by 3", trap: [0, "subtract 1 from both sides"] },
  ],
}));
