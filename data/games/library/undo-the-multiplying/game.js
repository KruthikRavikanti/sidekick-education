// Undo the Multiplying. Skill 6.EE.B.7-2.
// Solving equations of the form px = q. Subtracting p instead of dividing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Undo the Multiplying",
  emoji: "🧮",
  premise: "4x means 4 times x. To find x, undo the multiplying by dividing both sides.",
  outro: "To solve px = q, divide both sides by p.",
  scene: "desk",
  kind: "type",
  hint: "4x means 4 times x. What undoes multiplying?",
  tag: "subtracts_instead_of_dividing",
  rounds: [
    { say: "Key in the value of x that balances the scale.", q: "4x = 36", view: { type: "balance", eq: [4, 0, 0, 36] }, ans: 9, trap: 32, why: "That subtracted 4. The 4 is multiplying x, so divide.", win: "36 ÷ 4 = 9." },
    { say: "Key in the value of x.", q: "5x = 45", view: { type: "balance", eq: [5, 0, 0, 45] }, ans: 9, trap: 40, why: "The 5 multiplies x. Divide both sides by 5.", win: "45 ÷ 5 = 9." },
    { say: "Solve by yourself.", alt: [{ q: "6x = 42", ans: 7, trap: 36 }, { q: "8n = 56", ans: 7, trap: 48 }, { q: "3y = 27", ans: 9, trap: 24 }] },
  ],
}));
