// Plus or Minus Root. Skill A-REI.B.4-2.
// Solving quadratic equations by taking square roots. Forgetting the negative root is the known slip.
Sidekick.game(Sidekick.play({
  title: "Plus or Minus Root",
  emoji: "±",
  premise: "Taking a square root of both sides gives two answers, one positive and one negative. Keep both.",
  outro: "If (something)² = k, then something = √k or −√k.",
  scene: "night",
  kind: "pick",
  fs: 6.4,
  hint: "Which two numbers squared give that value? Then solve for x each time.",
  tag: "forgets_negative_root",
  rounds: [
    { say: "Tap every solution of x^2 = 81.", yes: "9 −9", no: "81 40.5 −81", trap: "-−9", why: "−9 × −9 is 81 as well.", win: "9 and −9." },
    { say: "Tap every solution of (x − 1)^2 = 16.", yes: "5 −3", no: "4 −4 17", trap: "-−3", why: "x − 1 can be −4 too, which gives x = −3.", win: "x − 1 = 4 or x − 1 = −4." },
    { say: "Tap every solution of (x + 2)^2 = 25 by yourself.", yes: "3 −7", no: "5 −5 7 23", trap: "-−7" },
  ],
}));
