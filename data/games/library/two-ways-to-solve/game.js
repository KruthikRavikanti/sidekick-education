// Two Ways to Solve. Skill 7.EE.B.4-2.
// Comparing an algebraic solution with an arithmetic solution. Being able to use only one method is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Ways to Solve",
  emoji: "🏋️",
  premise: "A story problem can be solved with an equation or by working backward with arithmetic. Both use the same steps in the same order.",
  outro: "The algebraic and arithmetic solutions undo the same operations in the same order.",
  scene: "city",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Take off the one-time fee first. Then divide by the cost of each.",
  tag: "only_one_method",
  rounds: [
    { say: "A gym costs $20 to join plus $5 per class. You paid $60. Match each part.", rows: [["Equation", "20 + 5c = 60"], ["Arithmetic", "(60 − 20) ÷ 5"], ["Both give", "c = 8"]], extra: "(60 ÷ 5) − 20|", trap: [1, "(60 ÷ 5) − 20"], why: "The joining fee comes off first, then you divide by 5.", win: "Same steps, two ways to write them." },
    { say: "A taxi charges $3 plus $2 a mile. The ride cost $15. Match each part.", rows: [["Equation", "3 + 2m = 15"], ["Arithmetic", "(15 − 3) ÷ 2"], ["Both give", "m = 6"]], extra: "(15 ÷ 2) − 3|", trap: [1, "(15 ÷ 2) − 3"], why: "Take off the $3 first. Then divide by 2.", win: "6 miles either way." },
    { say: "A plumber charges $40 plus $30 an hour. The bill was $130. Match these by yourself.", rows: [["Equation", "40 + 30h = 130"], ["Arithmetic", "(130 − 40) ÷ 30"], ["Both give", "h = 3"]], extra: "(130 ÷ 30) − 40|h = 4", trap: [1, "(130 ÷ 30) − 40"] },
  ],
}));
