// Unit Fraction Stack. Skill 4.NF.B.4-1.
// Understanding a/b as a multiple of 1/b: three fourths is 3 × 1/4. Using the denominator as the number of copies is the known slip.
Sidekick.game(Sidekick.play({
  title: "Unit Fraction Stack",
  emoji: "🧱",
  premise: "Every fraction is built from copies of one small piece. Three fourths is three copies of one fourth.",
  outro: "Any fraction is its top number times the unit fraction.",
  scene: "desk",
  kind: "fill",
  fs: 7,
  pSize: 6,
  cast: "",
  hint: "The top number tells how many pieces. The bottom number tells their size.",
  tag: "cannot_rewrite_as_multiple",
  rounds: [
    { say: "How many {1/4} pieces make {3/4}? Drag them onto the tray.", kind: "build", fs: 5, pile: [["{1/4}", 0.25, 8]], goal: 0.75, show: "count", trap: 1, why: "Four fourths make one whole. Three fourths needs three pieces.", win: "Three fourths is 3 copies of one fourth." },
    { say: "Finish each equation.", rows: [["{3/4} = ___ × {1/4}", "3"], ["{5/8} = ___ × {1/8}", "5"], ["{2/3} = 2 × ___", "{1/3}"]], extra: "4 8 {1/2}", trap: [0, "4"], why: "The 4 tells the size of the pieces. The 3 tells how many.", win: "Top number times the unit fraction." },
    { say: "Finish these by yourself.", rows: [["{4/5} = ___ × {1/5}", "4"], ["{7/10} = 7 × ___", "{1/10}"], ["{5/6} = ___ × {1/6}", "5"]], extra: "6 10 {1/7}", trap: [0, "5"] },
  ],
}));
