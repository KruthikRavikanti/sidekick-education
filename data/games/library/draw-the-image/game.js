// Draw the Image. Skill G-CO.A.5-1.
// Drawing the transformed figure given a rotation, reflection or translation. Reflecting over the other axis is the known slip.
Sidekick.game(Sidekick.play({
  title: "Draw the Image",
  emoji: "✏️",
  premise: "To draw a transformed figure, move each corner by the rule, then join the new corners.",
  outro: "Transform each vertex, then connect the image points.",
  scene: "paper",
  kind: "plot",
  cast: "",
  axes: [-4, 4, -4, 4],
  quiet: true,
  join: "shape",
  hint: "Over the x-axis, each point goes straight up or down. Over the y-axis, straight across.",
  tag: "reflects_over_other_line",
  rounds: [
    { say: "Reflect triangle ABC over the x-axis. Tap its three image corners.", given: [[1, 1, "A"], [4, 1, "B"], [1, 3, "C"]], segs: [[1, 1, 4, 1], [4, 1, 1, 3], [1, 3, 1, 1]], ans: [[1, -1], [4, -1], [1, -3]], trap: [[-1, 1], [-4, 1], [-1, 3]], why: "That flips over the y-axis. Over the x-axis, each corner drops straight down.", win: "Each y changes sign." },
    { say: "Translate triangle ABC left 3 and down 2. Tap its image corners.", given: [[0, 1, "A"], [3, 1, "B"], [0, 3, "C"]], segs: [[0, 1, 3, 1], [3, 1, 0, 3], [0, 3, 0, 1]], ans: [[-3, -1], [0, -1], [-3, 1]], trap: [[-2, -2], [1, -2], [-2, 0]], why: "That is left 2 and down 3. Left 3 changes x by 3, down 2 changes y by 2.", win: "Every corner moves the same way." },
    { say: "Draw the image by yourself.", alt: [{ say: "Reflect triangle ABC over the y-axis. Tap its image corners.", given: [[1, 1, "A"], [3, 1, "B"], [1, 4, "C"]], segs: [[1, 1, 3, 1], [3, 1, 1, 4], [1, 4, 1, 1]], ans: [[-1, 1], [-3, 1], [-1, 4]], trap: [[1, -1], [3, -1], [1, -4]] }, { say: "Rotate triangle ABC 180° about the origin. Tap its image corners.", given: [[1, 1, "A"], [3, 1, "B"], [1, 2, "C"]], segs: [[1, 1, 3, 1], [3, 1, 1, 2], [1, 2, 1, 1]], ans: [[-1, -1], [-3, -1], [-1, -2]], trap: [[-1, 1], [-3, 1], [-1, 2]] }] },
  ],
}));
