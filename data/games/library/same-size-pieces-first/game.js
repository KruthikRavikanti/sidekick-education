// Same Size Pieces First. Skill 4.NF.A.2-1.
// Comparing fractions with a common denominator: 3/4 is 6/8, which beats 5/8. Comparing only the numerators is the known slip.
Sidekick.game(Sidekick.play({
  title: "Same Size Pieces First",
  emoji: "⛳",
  premise: "You cannot compare fractions until their pieces are the same size. Rename one, then decide.",
  outro: "To compare fractions, give them the same denominator, then compare the top numbers.",
  scene: "field",
  kind: "fill",
  fs: 7,
  pSize: 6,
  cast: "",
  hint: "Rename one fraction so both have the same bottom number.",
  tag: "compares_only_numerators",
  rounds: [
    { say: "Drop the sign that makes each one true.", rows: [["{3/4} ___ {5/8}", ">"], ["{2/3} ___ {5/9}", ">"]], extra: "< =", trap: [0, "<"], why: "Make the pieces the same size: three fourths is six eighths.", win: "Six eighths beats five eighths." },
    { say: "Compare these.", rows: [["{1/2} ___ {4/10}", ">"], ["{2/5} ___ {7/10}", "<"], ["{3/6} ___ {1/2}", "="]], trap: [0, "<"], why: "One half is five tenths. That is more than four tenths.", win: "You renamed, then compared." },
    { say: "Compare these by yourself.", rows: [["{2/3} ___ {7/12}", ">"], ["{3/8} ___ {1/4}", ">"], ["{1/3} ___ {5/12}", "<"]], extra: "=", trap: [0, "<"] },
  ],
}));
