// The y = kx Rule. Skill 7.RP.A.2-3.
// Representing proportional relationships by equations of the form y = kx. Writing y = x + k is the known slip.
Sidekick.game(Sidekick.play({
  title: "The y = kx Rule",
  emoji: "🎟️",
  premise: "A proportional relationship is always written y = kx. The constant multiplies. It is never added.",
  outro: "Proportional means multiply: y = kx, not y = x + k.",
  scene: "city",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Each one costs the same, so the total is that cost TIMES how many.",
  tag: "adds_the_constant",
  rounds: [
    { say: "Write an equation for each.", rows: [["Each ticket costs $7. Cost t of n tickets.", "t = 7n"], ["A car goes 60 miles each hour. Distance d after h hours.", "d = 60h"]], extra: "t = n + 7|", trap: [0, "t = n + 7"], why: "Two tickets cost 14, not 2 + 7. The 7 multiplies.", win: "t = 7n and d = 60h." },
    { say: "Which rule fits every column of the table?", fig: { type: "table", rows: [["x", 1, 2, 3], ["y", 4, 8, 12]] }, rows: [["The rule is", "y = 4x"]], extra: "y = x + 3|y = 3x", trap: [0, "y = x + 3"], why: "x + 3 works only for the first column. Is 8 equal to 2 + 3?", win: "Every y is 4 times its x." },
    { say: "Write these by yourself.", rows: [["Pencils cost $2 each. Cost c of p pencils.", "c = 2p"], ["You read 15 pages a day. Pages p after d days.", "p = 15d"]], extra: "c = p + 2|p = d + 15", trap: [0, "c = p + 2"] },
  ],
}));
