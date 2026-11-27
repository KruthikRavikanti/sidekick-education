// So Many Solutions. Skill 6.EE.B.8-2.
// Recognizing that inequalities of the form x > c or x < c have infinitely many solutions. Giving only one answer is the known slip.
Sidekick.game(Sidekick.play({
  title: "So Many Solutions",
  emoji: "♾️",
  premise: "An equation like x + 2 = 7 has one solution. An inequality like x > 5 has more solutions than you could ever list.",
  outro: "An inequality has infinitely many solutions, including fractions and decimals.",
  scene: "space",
  kind: "pick",
  fs: 6.4,
  hint: "Check every card. Any number that makes it true is a solution.",
  tag: "gives_one_solution",
  rounds: [
    { say: "Tap every solution of x > 5.", yes: "6 7.5 100 5.1", no: "5 4 0", trap: "-7.5", why: "7.5 is greater than 5 too. Decimals count.", win: "Four of them work, and many more do too." },
    { say: "Tap every solution of x < 2.", yes: "1 0 −3 1.9", no: "2 3 10", trap: "-−3", why: "−3 is less than 2. Negative numbers count.", win: "Solutions go on forever to the left." },
    { say: "Tap every solution of x > −1.", yes: "0 5 −0.5 20", no: "−1 −2 −10", trap: "-−0.5" },
  ],
}));
