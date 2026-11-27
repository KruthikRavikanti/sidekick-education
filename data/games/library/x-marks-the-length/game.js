// X Marks the Length. Skill 2.MD.D.9-2.
// Showing measurement data on a line plot: one X per object above its length. Putting one X for each different length is the known slip.
Sidekick.game(Sidekick.play({
  title: "X Marks the Length",
  emoji: "❌",
  premise: "Each thing you measured gets one X above its length. Build the line plot from the list.",
  outro: "On a line plot, each X is one thing, placed above its length.",
  scene: "paper",
  kind: "dial",
  cast: "",
  view: { type: "bars", stack: true, cap: 5, tick: 1 },
  hint: "Go down the list. Each thing adds one X above its number.",
  tag: "one_mark_per_value",
  rounds: [
    { say: "Build the line plot for the crayons.", q: "Crayon lengths in inches: 3, 4, 3, 5, 3", dials: [["3 in", 0, 5], ["4 in", 0, 5], ["5 in", 0, 5]], ans: [3, 1, 1], trap: [1, 1, 1], why: "Three crayons are 3 inches long. Each crayon gets its own X.", win: "Three X marks above 3." },
    { say: "Build the line plot for the pencils.", q: "Pencil lengths in inches: 6, 7, 7, 5, 7, 6", dials: [["5 in", 0, 5], ["6 in", 0, 5], ["7 in", 0, 5]], ans: [1, 2, 3], trap: [1, 1, 1], why: "Count how many pencils have each length.", win: "One, two and three X marks." },
    { say: "Build this line plot by yourself.", alt: [{ q: "Leaf lengths in inches: 2, 4, 4, 3, 2, 4, 4", dials: [["2 in", 0, 5], ["3 in", 0, 5], ["4 in", 0, 5]], ans: [2, 1, 4], trap: [1, 1, 1] }, { q: "Worm lengths in inches: 8, 9, 8, 8, 10, 9", dials: [["8 in", 0, 5], ["9 in", 0, 5], ["10 in", 0, 5]], ans: [3, 2, 1], trap: [1, 1, 1] }] },
  ],
}));
