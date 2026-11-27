// Corner Finder. Skill 6.NS.C.8-1.
// Solving problems by graphing points in all four quadrants. Counting from the other axis is the known slip.
Sidekick.game(Sidekick.play({
  title: "Corner Finder",
  emoji: "📐",
  premise: "Plot corner points in all four quadrants and a shape appears. Count from the right axis each time.",
  outro: "Plot each point by moving along x first, then along y.",
  scene: "paper",
  kind: "plot",
  cast: "",
  axes: [-4, 4, -4, 4],
  join: "shape",
  quiet: true,
  hint: "Start at the origin. Move left or right by x, then up or down by y.",
  tag: "counts_from_other_axis",
  rounds: [
    { say: "Plot (−4, 3), (2, 3) and (2, −1).", ans: [[-4, 3], [2, 3], [2, -1]], trap: [[3, -4], [3, 2], [-1, 2]], why: "Those are the same numbers with x and y swapped.", win: "Three corners of a right triangle." },
    { say: "Plot (−3, −2), (3, −2) and (3, 2).", ans: [[-3, -2], [3, -2], [3, 2]], trap: [[-2, -3], [-2, 3], [2, 3]], why: "x comes first: −3 means left 3.", win: "Another right triangle." },
    { say: "Plot the corners by yourself.", alt: [{ say: "Plot (−2, 4), (−2, −1) and (3, −1) by yourself.", ans: [[-2, 4], [-2, -1], [3, -1]], trap: [[4, -2], [-1, -2], [-1, 3]] }, { say: "Plot (1, 3), (−4, 3) and (−4, −2) by yourself.", ans: [[1, 3], [-4, 3], [-4, -2]], trap: [[3, 1], [3, -4], [-2, -4]] }] },
  ],
}));
