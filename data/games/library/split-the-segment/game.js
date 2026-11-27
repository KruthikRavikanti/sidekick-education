// Split the Segment. Skill G-GPE.B.6-1.
// Finding the point on a directed line segment that partitions it in a given ratio. Using the ratio as a fraction of the whole (1 : 2 as one half) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Split the Segment",
  emoji: "🪚",
  premise: "A ratio of 1 to 2 cuts a segment into 3 equal steps. The point sits 1 step from the start.",
  outro: "A ratio a : b splits a segment into a + b equal parts. The point is a parts from the start.",
  scene: "paper",
  kind: "plot",
  cast: "",
  axes: [0, 8, 0, 8],
  quiet: true,
  hint: "Add the two ratio numbers to count the equal steps.",
  tag: "ratio_as_fraction_of_whole",
  rounds: [
    { say: "Tap the point that splits the segment from A to B in the ratio 1 to 2.", given: [[0, 0, "A"], [6, 6, "B"]], segs: [[0, 0, 6, 6]], ans: [[2, 2]], trap: [[3, 3]], why: "(3, 3) is halfway. 1 to 2 means 3 equal steps, and the point is 1 step from A.", win: "One third of the way: (2, 2)." },
    { say: "Tap the point that splits the segment from A to B in the ratio 3 to 1.", given: [[0, 0, "A"], [8, 4, "B"]], segs: [[0, 0, 8, 4]], ans: [[6, 3]], trap: [[2, 1]], why: "That is 1 step from A. The ratio 3 to 1 puts the point 3 of the 4 steps along.", win: "Three fourths of the way: (6, 3)." },
    { say: "Tap the point by yourself.", alt: [{ say: "By yourself: split the segment from A to B in the ratio 1 to 3.", given: [[0, 0, "A"], [8, 8, "B"]], segs: [[0, 0, 8, 8]], ans: [[2, 2]], trap: [[4, 4]] }, { say: "By yourself: split the segment from A to B in the ratio 2 to 1.", given: [[0, 0, "A"], [6, 3, "B"]], segs: [[0, 0, 6, 3]], ans: [[4, 2]], trap: [[2, 1]] }, { say: "By yourself: split the segment from A to B in the ratio 1 to 2.", given: [[1, 1, "A"], [7, 4, "B"]], segs: [[1, 1, 7, 4]], ans: [[3, 2]], trap: [[4, 3]] }] },
  ],
}));
