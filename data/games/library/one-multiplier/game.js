// One Multiplier. Skill 7.EE.A.2-1.
// Understanding that rewriting an expression in a different form can show how quantities are related. Seeing the forms as unrelated is the known slip.
Sidekick.game(Sidekick.play({
  title: "One Multiplier",
  emoji: "🏷️",
  premise: "A price plus 5% of itself is the same as 1.05 times the price. Rewriting shows the whole change as one multiplication.",
  outro: "p + 0.05p = 1.05p. An increase of 5% means multiplying by 1.05.",
  scene: "city",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Start with 1 whole price. Add or take away the percent as a decimal.",
  tag: "forms_unrelated",
  rounds: [
    { say: "Match each change to its one-step expression.", rows: [["a price p goes up 5%", "1.05p"], ["a price p is cut by 20%", "0.80p"]], extra: "0.05p|", trap: [0, "0.05p"], why: "0.05p is only the increase. The new price is p plus that.", win: "One multiplier does the whole job." },
    { say: "Simplify each expression.", rows: [["p + 0.25p =", "1.25p"], ["p − 0.10p =", "0.90p"], ["p + 0.08p =", "1.08p"]], extra: "0.25p|", trap: [0, "0.25p"], why: "p is 1p. So 1p + 0.25p is 1.25p.", win: "Three single multipliers." },
    { say: "Match these by yourself.", rows: [["a 30% discount on p", "0.70p"], ["a 7% tax added to p", "1.07p"], ["a 50% increase on p", "1.50p"]], extra: "0.30p|0.07p", trap: [0, "0.30p"] },
  ],
}));
