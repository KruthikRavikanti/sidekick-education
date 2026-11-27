// Motions in Order. Skill G-CO.A.5-2.
// Specifying a sequence of transformations that will carry a given figure onto another. Giving the steps in the other order is the known slip.
Sidekick.game(Sidekick.play({
  title: "Motions in Order",
  emoji: "🪜",
  premise: "Two motions done in a different order can land a figure in a different place. Name the steps and their order.",
  outro: "Specify a sequence of transformations that carries one figure onto another, in the correct order.",
  scene: "paper",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Track one corner. Where does it go after the first step? After the second?",
  tag: "steps_out_of_order",
  rounds: [
    { say: "Which two steps, in order, take A onto B?", fig: { type: "graph", fn: "none", shapes: [{ pts: [[1, 1], [3, 1], [1, 2]], name: "A" }, { pts: [[1, 2], [3, 2], [1, 1]], name: "B" }], win: [-5, 5, -5, 5], h: 46, v: [] }, rows: [["first", "reflect over the x-axis"], ["then", "translate up 3"]], extra: "translate down 3|", trap: [0, "translate up 3"], why: "Sliding up first and then flipping would land it far below the axis.", win: "Flip, then slide up 3." },
    { say: "Which two steps, in order, take A onto B?", fig: { type: "graph", fn: "none", shapes: [{ pts: [[1, 1], [2, 1], [1, 3]], name: "A" }, { pts: [[-3, 1], [-4, 1], [-3, 3]], name: "B" }], win: [-5, 5, -5, 5], h: 46, v: [] }, rows: [["first", "translate right 2"], ["then", "reflect over the y-axis"]], extra: "translate left 2|", trap: [0, "reflect over the y-axis"], why: "Reflecting first and then sliding right 2 would bring it back onto A.", win: "Slide, then flip." },
    { say: "Give the two steps by yourself.", fig: { type: "graph", fn: "none", shapes: [{ pts: [[1, 1], [3, 1], [1, 2]], name: "A" }, { pts: [[1, -2], [3, -2], [1, -3]], name: "B" }], win: [-5, 5, -5, 5], h: 46, v: [] }, rows: [["first", "reflect over the x-axis"], ["then", "translate down 1"]], extra: "translate up 1|rotate 90°", trap: [0, "translate down 1"] },
  ],
}));
