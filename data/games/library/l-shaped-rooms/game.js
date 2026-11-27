// L-Shaped Rooms. Skill 3.MD.C.7-4.
// Finding the area of a rectilinear figure by splitting it into non-overlapping rectangles. Counting the overlapping corner twice is the known slip.
Sidekick.game(Sidekick.play({
  title: "L-Shaped Rooms",
  emoji: "🛋️",
  premise: "These rooms are shaped like the letter L. Cut each one into two rectangles and add their areas.",
  outro: "Split an L-shape into rectangles that do not overlap, then add their areas.",
  scene: "desk",
  kind: "type",
  icon: "🛋️",
  hint: "Draw one cut. Make sure the two rectangles do not share any floor.",
  tag: "counts_the_overlap_twice",
  rounds: [
    { say: "Key in the area of the room in square units.", fig: { type: "poly", pts: [[0, 0], [40, 0], [40, 40], [100, 40], [100, 80], [0, 80]], sides: ["2", "2", "3", "2", "5", "4"], color: "lime" }, ans: 14, trap: 18, why: "The corner got counted twice. Use a 2 by 4 and a 3 by 2.", win: "8 + 6 = 14 square units." },
    { say: "Key in the area of this room.", fig: { type: "poly", pts: [[0, 0], [33, 0], [33, 50], [100, 50], [100, 83], [0, 83]], sides: ["2", "3", "4", "2", "6", "5"], color: "lime" }, ans: 18, trap: 22, why: "The corner got counted twice. Use a 2 by 5 and a 4 by 2.", win: "10 + 8 = 18 square units." },
    { say: "Find the area by yourself.", alt: [{ fig: { type: "poly", pts: [[0, 0], [43, 0], [43, 29], [100, 29], [100, 57], [0, 57]], sides: ["3", "2", "4", "2", "7", "4"], color: "lime" }, ans: 20, trap: 26 }, { fig: { type: "poly", pts: [[0, 0], [33, 0], [33, 67], [67, 67], [67, 100], [0, 100]], sides: ["2", "4", "2", "2", "4", "6"], color: "lime" }, ans: 16, trap: 20 }] },
  ],
}));
