// Fraction Bar Means Divide. Skill 5.NF.B.3-1.
// Interpreting a fraction as division of the numerator by the denominator: 3 ÷ 4 = 3/4. Flipping the fraction is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fraction Bar Means Divide",
  emoji: "➗",
  premise: "A fraction and a division are the same thing written two ways. 3 ÷ 4 is three fourths.",
  outro: "a ÷ b is the fraction a over b. The number being divided is the top number.",
  scene: "desk",
  kind: "fill",
  fs: 6,
  pSize: 6,
  cast: "",
  hint: "The first number, the one being shared, is the top number.",
  tag: "flips_the_fraction",
  rounds: [
    { say: "Write each division as a fraction.", rows: [["3 ÷ 4 =", "{3/4}"], ["5 ÷ 8 =", "{5/8}"]], extra: "{4/3} {8/5}", trap: [0, "{4/3}"], why: "3 things shared by 4 gives less than 1 each. The 3 is the top number.", win: "Three fourths and five eighths." },
    { say: "Now write each fraction as a division.", fs: 5, rows: [["{7/2} =", "7 ÷ 2"], ["{2/7} =", "2 ÷ 7"]], extra: "7 × 2|", trap: [0, "2 ÷ 7"], why: "The top number is the one being divided.", win: "7 ÷ 2 and 2 ÷ 7." },
    { say: "Match these by yourself.", fs: 5, rows: [["2 ÷ 5 =", "{2/5}"], ["9 ÷ 4 =", "{9/4}"], ["{1/6} =", "1 ÷ 6"]], extra: "{5/2}|{4/9}|6 ÷ 1", trap: [0, "{5/2}"] },
  ],
}));
