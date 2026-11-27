// Two-Step Balance. Skill 7.EE.B.4-1.
// Solving equations of the form px + q = r and p(x + q) = r. Undoing the operations in the reverse of the right order is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two-Step Balance",
  emoji: "⚖️",
  premise: "A two-step equation is unwrapped in reverse. Undo the adding or subtracting first, then undo the multiplying.",
  outro: "To solve px + q = r, subtract q from both sides, then divide by p.",
  scene: "desk",
  kind: "type",
  hint: "Take away the loose number first. Then divide.",
  tag: "undoes_in_reverse_order",
  rounds: [
    { say: "Key in the value of x that balances the scale.", q: "2x + 6 = 20", view: { type: "balance", eq: [2, 6, 0, 20] }, ans: "7", trap: "4", why: "That divided first, then subtracted. Subtract 6 first: 2x = 14.", win: "2x = 14, so x = 7." },
    { say: "Key in the value of x.", q: "2(x + 3) = 16", ans: "5", trap: "6.5", why: "Here the 2 multiplies the whole bracket. Divide by 2 first: x + 3 = 8.", win: "x + 3 = 8, so x = 5." },
    { say: "Solve by yourself.", alt: [{ q: "3x + 5 = 20", ans: "5", trap: "15" }, { q: "4x + 2 = 30", ans: "7", trap: "5.5" }, { q: "5x − 5 = 30", ans: "7", trap: "1" }, { q: "2x + 8 = 20", ans: "6", trap: "2" }] },
  ],
}));
