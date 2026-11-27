// x on Both Sides. Skill 8.EE.C.7-2.
// Solving linear equations with variables on both sides. Moving terms without changing their signs is the known slip.
Sidekick.game(Sidekick.play({
  title: "x on Both Sides",
  emoji: "⚖️",
  premise: "When x is on both sides, take the same amount of x off each pan. Whatever you do to one side, do to the other.",
  outro: "Subtract the smaller x term from both sides, then solve as usual.",
  scene: "desk",
  kind: "type",
  hint: "Take 2x away from BOTH sides. Then undo the adding.",
  tag: "moves_without_changing_sign",
  rounds: [
    { say: "Key in the value of x that balances the scale.", q: "4x + 2 = 2x + 10", view: { type: "balance", eq: [4, 2, 2, 10] }, ans: 4, trap: 2, why: "That added the x terms. Take 2x off both sides: 2x + 2 = 10.", win: "2x = 8, so x = 4." },
    { say: "Key in the value of x.", q: "5x − 3 = 2x + 9", ans: 4, trap: 2, why: "After 3x − 3 = 9, ADD 3 to both sides: 3x = 12.", win: "3x = 12, so x = 4." },
    { say: "Solve by yourself.", alt: [{ q: "6x + 1 = 2x + 9", ans: 2, trap: 1 }, { q: "7x − 4 = 3x + 8", ans: 3, trap: 1 }, { q: "3x + 5 = x + 13", ans: 4, trap: 2 }] },
  ],
}));
