// Smaller Pieces. Skill 3.NF.A.3-4.
// Comparing fractions with the same numerator or the same denominator: eighths are smaller than fourths. Judging by the bigger denominator is the known slip.
Sidekick.game(Sidekick.play({
  title: "Smaller Pieces",
  emoji: "🧇",
  premise: "Cut a waffle into more pieces and each piece gets smaller. Compare the fractions and drop in the sign.",
  outro: "With the same top number, the bigger bottom number means smaller pieces. With the same bottom number, more pieces means more.",
  scene: "kitchen",
  kind: "fill",
  fs: 7,
  pSize: 6,
  cast: "",
  hint: "More pieces in the whole means each piece is smaller.",
  tag: "bigger_denominator_means_bigger",
  rounds: [
    { say: "Drop the sign that makes each one true.", rows: [["{1/8} ___ {1/4}", "<"], ["{1/3} ___ {1/6}", ">"]], extra: "=", trap: [0, ">"], why: "Eighths are smaller pieces than fourths. One eighth is less.", win: "Smaller pieces, smaller fraction." },
    { say: "Now some have the same bottom number.", rows: [["{2/6} ___ {5/6}", "<"], ["{3/4} ___ {3/8}", ">"], ["{2/4} ___ {2/4}", "="]], trap: [1, "<"], why: "Fourths are bigger pieces than eighths, so three fourths is more.", win: "You compared them all." },
    { say: "Compare these by yourself.", rows: [["{1/6} ___ {1/2}", "<"], ["{5/8} ___ {3/8}", ">"], ["{2/3} ___ {2/6}", ">"]], extra: "=", trap: [0, ">"] },
  ],
}));
