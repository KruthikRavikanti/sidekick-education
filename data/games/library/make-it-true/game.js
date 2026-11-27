// Make It True. Skill 6.EE.B.5-1.
// Understanding solving an equation or inequality as finding which values make it true. Thinking the solution is just the number on the right is the known slip.
Sidekick.game(Sidekick.play({
  title: "Make It True",
  emoji: "🗝️",
  premise: "A solution is a value that makes the equation or inequality a true statement. Try each one.",
  outro: "A solution makes the statement true when you put it in for the variable.",
  scene: "night",
  kind: "pick",
  fs: 6.4,
  hint: "Put the value in place of x. Is the statement true?",
  tag: "picks_number_on_the_right",
  rounds: [
    { say: "Tap the value that makes x + 7 = 12 true.", yes: "5", no: "12 19 7", trap: "12", why: "12 + 7 is 19, not 12. Try a smaller number.", win: "5 + 7 = 12." },
    { say: "Tap every value that makes x > 5 true.", yes: "6 9 12", no: "5 2 0", trap: "5", why: "5 is not greater than 5.", win: "6, 9 and 12 all work." },
    { say: "Tap every value that makes 3x < 12 true.", yes: "0 2 3", no: "4 5 12", trap: "12" },
  ],
}));
