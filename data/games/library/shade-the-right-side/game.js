// Shade the Right Side. Skill A-REI.D.12-1.
// Graphing the solutions to a linear inequality in two variables as a half-plane. Shading the opposite side is the known slip.
Sidekick.game(Sidekick.play({
  title: "Shade the Right Side",
  emoji: "🌗",
  premise: "An inequality in two variables is graphed as half of the plane. Test a point to see which side to shade.",
  outro: "y > mx + b shades above the line. y < mx + b shades below. Test a point such as (0, 0) to check.",
  scene: "paper",
  kind: "fill",
  fs: 6,
  figW: 20,
  cast: "",
  hint: "Pick a test point such as (0, 0). Does it make the inequality true?",
  tag: "shades_other_side",
  rounds: [
    { say: "Match each inequality to its graph.", rows: [["y > 2x + 1", "~half:a:d"], ["y < 2x + 1", "~half:b:d"]], extra: "~half:a:s", trap: [0, "~half:b:d"], why: "y greater than the line means the points above it.", win: "Greater is above. Less is below." },
    { say: "For y > 2x + 1, is each point in the shaded region?", kind: "sort", bins: "In the region|Not in it", items: ["(0, 3)|(−2, 0)", "(0, 0)|(2, 1)|(1, 3)"], trap: ["(0, 0)", 0], why: "Test it: is 0 greater than 2 × 0 + 1? No.", win: "(1, 3) sits on the boundary, which is not included." },
    { say: "Match these by yourself.", rows: [["y ≥ −x + 2", "~half:a:s:n"], ["y ≤ −x + 2", "~half:b:s:n"]], extra: "~half:a:d:n ~half:b:d:n", trap: [0, "~half:b:s:n"] },
  ],
}));
