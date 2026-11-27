// Solve the Formula. Skill A-CED.A.4-1.
// Rearranging formulas to highlight a quantity of interest. Moving terms without inverse operations is the known slip.
Sidekick.game(Sidekick.play({
  title: "Solve the Formula",
  emoji: "🔧",
  premise: "A formula can be turned around to give any of its letters. Use the same inverse steps you use on equations with numbers.",
  outro: "Rearrange a formula with inverse operations: A = ½bh gives h = 2A ÷ b.",
  scene: "desk",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "What is being done to the letter you want? Undo it on both sides.",
  tag: "moves_without_inverse",
  rounds: [
    { say: "Solve each formula for the letter named.", rows: [["A = {1/2}bh, for h", "h = {2A/b}"], ["d = rt, for t", "t = {d/r}"]], extra: "h = {A/2b}|", trap: [0, "h = {A/2b}"], why: "Undo the half by multiplying by 2, then divide by b.", win: "Inverse steps, in order." },
    { say: "Solve each formula.", rows: [["P = 2l + 2w, for w", "w = {P − 2l/2}"], ["V = lwh, for h", "h = {V/lw}"], ["y = mx + b, for x", "x = {y − b/m}"]], extra: "x = {y + b/m}|", trap: [2, "x = {y + b/m}"], why: "b is added, so subtract it. Then divide by m.", win: "Subtract first, then divide." },
    { say: "Solve these by yourself.", rows: [["C = 2πr, for r", "r = {C/2π}"], ["I = prt, for r", "r = {I/pt}"], ["F = ma, for a", "a = {F/m}"]], extra: "r = 2πC|a = Fm", trap: [0, "r = 2πC"] },
  ],
}));
