// Prove It With Coordinates. Skill G-GPE.B.4-1.
// Using coordinates to prove simple geometric theorems algebraically. Using a special case as proof is the known slip.
Sidekick.game(Sidekick.play({
  title: "Prove It With Coordinates",
  emoji: "📍",
  premise: "Coordinates turn geometry into arithmetic. Slopes prove sides parallel. Distances prove sides equal.",
  outro: "A coordinate proof uses slopes and distances for the general figure, not one lucky example.",
  scene: "paper",
  kind: "plot",
  cast: "",
  axes: [0, 8, 0, 8],
  join: "shape",
  quiet: true,
  hint: "Opposite sides of a parallelogram have the same run and the same rise.",
  tag: "special_case_as_proof",
  rounds: [
    { say: "Three corners of a parallelogram are shown. Tap the fourth corner, D, so both pairs of opposite sides are parallel.", given: [[1, 1, "A"], [5, 1, "B"], [7, 4, "C"]], ans: [[3, 4]], trap: [[1, 4]], why: "From (1, 4) the left side goes straight up, but the right side slants. Match B to C: right 2, up 3.", win: "A to D copies B to C: right 2, up 3." },
    { say: "Corners (0, 0), (4, 0), (4, 3), (0, 3). Which facts prove it is a rectangle?", kind: "sort", fs: 4.6, bins: "Proves it|Does not", items: ["Opposite sides have equal slopes.|Neighbor sides have slopes 0 and undefined, so they are perpendicular.", "It looks like a rectangle.|One example of a rectangle has these corners."], trap: ["It looks like a rectangle.", 0], why: "Looks are not proof. Slopes are.", win: "Parallel opposite sides and square corners." },
    { say: "Tap the fourth corner of the parallelogram by yourself.", alt: [{ given: [[1, 2, "A"], [4, 1, "B"], [6, 5, "C"]], ans: [[3, 6]], trap: [[1, 5]] }, { given: [[2, 1, "A"], [6, 2, "B"], [7, 6, "C"]], ans: [[3, 5]], trap: [[2, 6]] }, { given: [[0, 3, "A"], [3, 1, "B"], [7, 3, "C"]], ans: [[4, 5]], trap: [[0, 5]] }] },
  ],
}));
