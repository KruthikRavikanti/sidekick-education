// Undo the Adding. Skill 6.EE.B.7-1.
// Solving equations of the form x + p = q. Adding p to both sides instead of subtracting is the known slip.
Sidekick.game(Sidekick.play({
  title: "Undo the Adding",
  emoji: "⚖️",
  premise: "An equation is a balanced scale. To find x, undo what was added to it, on both sides.",
  outro: "To solve x + p = q, subtract p from both sides.",
  scene: "desk",
  kind: "type",
  hint: "What was added to x? Do the opposite to both sides.",
  tag: "adds_instead_of_subtracting",
  rounds: [
    { say: "Key in the value of x that balances the scale.", q: "x + 9 = 23", view: { type: "balance", eq: [1, 9, 0, 23] }, ans: 14, trap: 32, why: "That added 9. To undo adding 9, subtract it.", win: "23 − 9 = 14." },
    { say: "Key in the value of x.", q: "x + 15 = 40", view: { type: "balance", eq: [1, 15, 0, 40] }, ans: 25, trap: 55, why: "Undo the + 15 by subtracting 15.", win: "40 − 15 = 25." },
    { say: "Solve by yourself.", alt: [{ q: "x + 7 = 31", ans: 24, trap: 38 }, { q: "n + 18 = 50", ans: 32, trap: 68 }, { q: "y + 26 = 61", ans: 35, trap: 87 }] },
  ],
}));
