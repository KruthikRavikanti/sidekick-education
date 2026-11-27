// How Big Is the Sum?. Skill N-VM.B.4-2.
// Determining the magnitude and direction of the sum of two vectors. Adding magnitudes, or using another angle, is the known slip.
Sidekick.game(Sidekick.play({
  title: "How Big Is the Sum?",
  emoji: "💪",
  premise: "Two forces together make one total force. Its size comes from adding components first, then finding the length.",
  outro: "Add components first. Then magnitude = √(x^2 + y^2), and direction comes from the components.",
  scene: "field",
  kind: "type",
  icon: "💪",
  hint: "Add the two vectors by components first. Then find the length of the result.",
  tag: "adds_magnitudes",
  rounds: [
    { say: "Forces of 3 newtons east and 4 newtons north act on a box. Key in the size of the total force.", fig: { type: "poly", pts: [[12, 86], [88, 86], [88, 26]], sides: ["3", "4", "?"], right: 1, v: [], h: 34 }, ans: 5, trap: 7, why: "They pull in different directions, so the total is the diagonal.", win: "√(9 + 16) = 5 newtons." },
    { say: "Which way does each total point? Angles are measured from east.", kind: "fill", fs: 5.6, cast: "", rows: [["(3, 3)", "45°"], ["(0, 5)", "90°"], ["(−2, 0)", "180°"]], extra: "0° 135°", trap: [0, "90°"], why: "(3, 3) goes equally east and north: halfway between, 45°.", win: "Equal parts give 45°." },
    { say: "Add the vectors, then key in the magnitude of the sum by yourself.", alt: [{ q: "u = (2, 5) and v = (4, 3)", ans: 10, trap: 14 }, { q: "u = (1, 1) and v = (4, 11)", ans: 13, trap: 17 }, { q: "u = (−1, 2) and v = (4, 2)", ans: 5, trap: 7 }] },
  ],
}));
