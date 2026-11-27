// Fifths Join Up. Skill 4.NF.B.3-1.
// Adding and subtracting fractions as joining and separating parts of the same whole. Adding the denominators too (1/5 + 2/5 = 3/10) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fifths Join Up",
  emoji: "🧩",
  premise: "Adding fractions joins pieces of the same size. The pieces do not change size when you join them.",
  outro: "With the same denominator, add or subtract the top numbers. The bottom number stays.",
  scene: "candy",
  kind: "fill",
  fs: 7,
  pSize: 6,
  cast: "",
  hint: "Count the pieces. They are all the same size, so the bottom number stays.",
  tag: "adds_the_denominators",
  rounds: [
    { say: "Join the pieces. Drop each answer in place.", fig: { type: "frac", ref: [1, 5], den: 5, v: [2] }, rows: [["{1/5} + {2/5} =", "{3/5}"], ["{5/8} − {2/8} =", "{3/8}"]], extra: "{3/10} {7/16}", trap: [0, "{3/10}"], why: "The pieces are still fifths. Only the number of pieces changes.", win: "One fifth and two fifths make three fifths." },
    { say: "Add and subtract these.", rows: [["{3/8} + {4/8} =", "{7/8}"], ["{9/10} − {6/10} =", "{3/10}"]], extra: "{7/16} {3/20}", trap: [0, "{7/16}"], why: "Eighths joined with eighths are still eighths.", win: "Seven eighths and three tenths." },
    { say: "Finish these by yourself.", rows: [["{2/6} + {3/6} =", "{5/6}"], ["{7/12} − {2/12} =", "{5/12}"], ["{4/10} + {5/10} =", "{9/10}"]], extra: "{9/20} {5/24}", trap: [0, "{5/12}"] },
  ],
}));
