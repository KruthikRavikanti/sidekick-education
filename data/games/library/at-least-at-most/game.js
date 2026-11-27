// At Least, At Most. Skill 6.EE.B.8-1.
// Writing an inequality of the form x > c or x < c to represent a constraint. Using the reversed direction is the known slip.
Sidekick.game(Sidekick.play({
  title: "At Least, At Most",
  emoji: "🎢",
  premise: "Rules and limits are written as inequalities. At least means that number or more. At most means that number or less.",
  outro: "At least is ≥. At most is ≤. More than is >. Less than is <.",
  scene: "sky",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Would a bigger number still follow the rule, or a smaller one?",
  tag: "reversed_direction",
  rounds: [
    { say: "Write each rule as an inequality. h is height in inches.", rows: [["at least 48 inches tall", "h ≥ 48"], ["less than 48 inches tall", "h < 48"]], extra: "h ≤ 48|", trap: [0, "h ≤ 48"], why: "At least 48 means 48 or MORE.", win: "At least is ≥." },
    { say: "Write these rules. w is weight in pounds.", rows: [["at most 50 pounds", "w ≤ 50"], ["more than 50 pounds", "w > 50"], ["at least 50 pounds", "w ≥ 50"]], extra: "w < 50|", trap: [0, "w ≥ 50"], why: "At most 50 means 50 or LESS.", win: "Three limits." },
    { say: "Write these by yourself. t is temperature.", rows: [["below 32 degrees", "t < 32"], ["no more than 90 degrees", "t ≤ 90"], ["at least 60 degrees", "t ≥ 60"], ["above 100 degrees", "t > 100"]], trap: [1, "t ≥ 60"] },
  ],
}));
