// Name the Move. Skill 8.G.A.2-2.
// Describing a sequence of rigid motions that exhibits congruence. Naming the line or direction imprecisely is the known slip.
Sidekick.game(Sidekick.play({
  title: "Name the Move",
  emoji: "🧭",
  premise: "Saying a shape moved is not enough. Name the motion exactly: how far, which way, or over which line.",
  outro: "Describe a rigid motion precisely: the distance and direction, the line of reflection, or the center and angle.",
  scene: "paper",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Pick one corner of A and find it on B. How did it get there?",
  tag: "imprecise_line_or_center",
  rounds: [
    { say: "Which move takes triangle A onto triangle B?", fig: { type: "graph", fn: "none", shapes: [{ pts: [[1, 1], [3, 1], [1, 4]], name: "A" }, { pts: [[5, 1], [7, 1], [5, 4]], name: "B" }], win: [0, 8, 0, 8], h: 50, v: [] }, rows: [["The move", "translate 4 right"]], extra: "translate 2 right|translate 4 up|reflect over the y-axis", trap: [0, "translate 2 right"], why: "Follow one corner: (1, 1) goes to (5, 1). That is 4 to the right.", win: "Every corner slides 4 right." },
    { say: "Which move takes A onto B?", fig: { type: "graph", fn: "none", shapes: [{ pts: [[1, 1], [3, 1], [1, 3]], name: "A" }, { pts: [[-1, 1], [-3, 1], [-1, 3]], name: "B" }], win: [-4, 4, -4, 4], h: 50, v: [] }, rows: [["The move", "reflect over the y-axis"]], extra: "reflect over the x-axis|translate 2 left", trap: [0, "reflect over the x-axis"], why: "The shapes are left and right of each other. The mirror line is the y-axis.", win: "A flip across the y-axis." },
    { say: "Name the move by yourself.", fig: { type: "graph", fn: "none", shapes: [{ pts: [[1, 1], [3, 1], [1, 3]], name: "A" }, { pts: [[1, -1], [3, -1], [1, -3]], name: "B" }], win: [-4, 4, -4, 4], h: 50, v: [] }, rows: [["The move", "reflect over the x-axis"]], extra: "reflect over the y-axis|translate 2 down|rotate 90°", trap: [0, "reflect over the y-axis"] },
  ],
}));
