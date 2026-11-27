// Mind the Denominator. Skill A-REI.A.2-1.
// Solving simple rational equations and noticing extraneous solutions. Forgetting the values that make a denominator zero is the known slip.
Sidekick.game(Sidekick.play({
  title: "Mind the Denominator",
  emoji: "🚧",
  premise: "Clear the fraction to solve a rational equation. Then check that your answer does not make any denominator zero.",
  outro: "Multiply to clear denominators, solve, then reject any value that makes a denominator 0.",
  scene: "city",
  kind: "type",
  icon: "🚧",
  hint: "Multiply both sides by the denominator. Then test your answer in the original.",
  tag: "ignores_excluded_values",
  rounds: [
    { say: "Solve for x.", q: "{12/x} = 3", ans: 4, trap: 36, why: "Multiply both sides by x: 12 = 3x. Then divide by 3.", win: "12 ÷ 4 = 3." },
    { say: "Solving {x/x − 2} = {2/x − 2} gives x = 2. Check it.", kind: "fill", fs: 5.2, cast: "", rows: [["x = 2 makes the denominator", "0"], ["so x = 2 is", "not allowed"], ["the equation has", "no solution"]], extra: "one solution|", trap: [2, "one solution"], why: "Dividing by zero is undefined, so x = 2 must be thrown out.", win: "Always check the denominators." },
    { say: "Solve for x by yourself.", alt: [{ q: "{10/x} = 2", ans: 5, trap: 20 }, { q: "{8/x + 1} = 2", ans: 3, trap: 4 }, { q: "{15/x − 2} = 5", ans: 5, trap: 3 }] },
  ],
}));
