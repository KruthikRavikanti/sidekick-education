// Common Ground. Skill 5.NF.A.1-1.
// Finding a common denominator: 2/3 and 1/4 become 8/12 and 3/12. Using a new denominator without changing the numerator is the known slip.
Sidekick.game(Sidekick.play({
  title: "Common Ground",
  emoji: "🤝",
  premise: "Thirds and fourths cannot be added until they are cut into the same size pieces. Find a size that works for both.",
  outro: "Rename both fractions with a denominator they share, changing the top number to match.",
  scene: "field",
  kind: "fill",
  fs: 6,
  pSize: 6,
  cast: "",
  hint: "Whatever you multiply the bottom by, multiply the top by the same number.",
  tag: "changes_only_the_denominator",
  rounds: [
    { say: "Rename both fractions as twelfths.", rows: [["{2/3} =", "{8/12}"], ["{1/4} =", "{3/12}"]], extra: "{2/12} {1/12}", trap: [0, "{2/12}"], why: "Each third is cut into 4 pieces, so 2 thirds become 8 twelfths.", win: "Eight twelfths and three twelfths." },
    { say: "Rename both fractions as tenths.", rows: [["{1/2} =", "{5/10}"], ["{3/5} =", "{6/10}"]], extra: "{1/10} {3/10}", trap: [1, "{3/10}"], why: "Each fifth is cut into 2 pieces, so 3 fifths become 6 tenths.", win: "Five tenths and six tenths." },
    { say: "Rename these as twelfths by yourself.", rows: [["{3/4} =", "{9/12}"], ["{1/6} =", "{2/12}"], ["{2/3} =", "{8/12}"]], extra: "{3/12} {1/12}", trap: [0, "{3/12}"] },
  ],
}));
