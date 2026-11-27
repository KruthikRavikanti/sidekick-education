// Connect the Corners. Skill 6.G.A.3-1.
// Drawing polygons in the coordinate plane given vertex coordinates. Connecting vertices in an order that crosses is the known slip.
Sidekick.game(Sidekick.play({
  title: "Connect the Corners",
  emoji: "📍",
  premise: "A polygon can be given by the coordinates of its corners. Plot them, then join them in order around the shape.",
  outro: "Plot each vertex, then connect them in order so the sides never cross.",
  scene: "paper",
  kind: "plot",
  cast: "",
  axes: [0, 8, 0, 8],
  join: "shape",
  quiet: true,
  hint: "Go around the outside of the shape, corner to next corner.",
  tag: "connects_in_crossing_order",
  rounds: [
    { say: "Plot the corners (1, 1), (5, 1), (5, 4) and (1, 4).", ans: [[1, 1], [5, 1], [5, 4], [1, 4]], trap: [[1, 1], [1, 5], [4, 5], [4, 1]], why: "The x and y got swapped. (5, 1) is 5 across and 1 up.", win: "A rectangle 4 units by 3 units." },
    { say: "Tap every order that walks around the rectangle without crossing.", kind: "pick", fs: 6, fig: { type: "poly", pts: [[15, 80], [85, 80], [85, 25], [15, 25]], names: ["A", "B", "C", "D"], v: [] }, yes: "A B C D|A D C B", no: "A C B D|A B D C", trap: "A C B D", why: "A to C cuts across the middle. Go to a neighbor corner next.", win: "Around one way, or around the other way." },
    { say: "Plot the corners by yourself.", alt: [{ say: "Plot (2, 1), (6, 1), (6, 5) and (2, 5) by yourself.", ans: [[2, 1], [6, 1], [6, 5], [2, 5]], trap: [[1, 2], [1, 6], [5, 6], [5, 2]] }, { say: "Plot (1, 1), (7, 1) and (4, 6) by yourself.", ans: [[1, 1], [7, 1], [4, 6]], trap: [[1, 1], [1, 7], [6, 4]] }] },
  ],
}));
