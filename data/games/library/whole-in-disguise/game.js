// Whole in Disguise. Skill 3.NF.A.3-3.
// Whole numbers as fractions: 4/4 is 1 and 3/1 is 3. Not seeing 4/4 as a whole is the known slip.
Sidekick.game(Sidekick.play({
  title: "Whole in Disguise",
  emoji: "🥸",
  premise: "Some fractions are whole numbers wearing a costume. Unmask them and sort them by what they are worth.",
  outro: "When the top and bottom match, the fraction is 1. A number over 1 is that whole number.",
  scene: "candy",
  kind: "sort",
  fs: 6,
  cast: "",
  hint: "How many parts make a whole? Do you have all of them?",
  tag: "four_fourths_is_not_a_whole",
  rounds: [
    { say: "What is each fraction worth?", bins: "Equals 1|Equals 3|Neither", items: ["{4/4} {2/2} {6/6}", "{3/1} {6/2}", "{1/4} {3/4}"], trap: ["{4/4}", 2], why: "Four fourths is all four parts of the whole. That is 1.", win: "All the parts make 1." },
    { say: "Unmask these fractions.", bins: "Equals 1|Equals 2|Neither", items: ["{3/3} {8/8}", "{2/1} {4/2}", "{1/2} {2/3}"], trap: ["{8/8}", 2], why: "Eight eighths is all eight parts of the whole. That is 1.", win: "You unmasked them all." },
    { say: "Sort these by yourself.", bins: "Equals 1|Equals 4|Neither", items: ["{5/5} {4/4} {1/1}", "{4/1} {8/2}", "{1/4} {4/8}"], trap: ["{4/4}", 1] },
  ],
}));
