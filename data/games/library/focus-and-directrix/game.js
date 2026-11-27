// Focus and Directrix. Skill G-GPE.A.2-1.
// Deriving the equation of a parabola given a focus and directrix. Mixing up the focus and the vertex is the known slip.
Sidekick.game(Sidekick.play({
  title: "Focus and Directrix",
  emoji: "🛰️",
  premise: "Every point of a parabola is as far from a point, the focus, as from a line, the directrix. The vertex sits exactly halfway.",
  outro: "The vertex is midway between focus and directrix. With p the distance from vertex to focus, y = x^2 ÷ (4p).",
  scene: "space",
  kind: "plot",
  cast: "",
  axes: [-4, 4, -4, 4],
  quiet: true,
  hint: "The vertex is halfway between the focus and the line.",
  tag: "focus_as_vertex",
  rounds: [
    { say: "The focus F is at (0, 2). The blue line y = −2 is the directrix. Tap the vertex of the parabola.", given: [[0, 2, "F"]], segs: [[-4, -2, 4, -2]], curves: [["quad", 0.125, 0, 0]], ans: [[0, 0]], trap: [[0, -2]], why: "That point is on the directrix. The vertex is halfway up to the focus.", win: "Halfway between y = 2 and y = −2: the origin." },
    { say: "Focus (0, 2), directrix y = −2. Finish the equation.", kind: "fill", fs: 5.6, rows: [["distance from vertex to focus, p", "2"], ["4p", "8"], ["equation", "y = {x^2/8}"]], extra: "y = {x^2/2}|", trap: [2, "y = {x^2/2}"], why: "The denominator is 4p, not p: 4 × 2 = 8.", win: "y = x^2 over 4p." },
    { say: "Tap the vertex by yourself.", alt: [{ say: "By yourself: the focus F is (0, 3) and the directrix is y = −1. Tap the vertex.", given: [[0, 3, "F"]], segs: [[-4, -1, 4, -1]], ans: [[0, 1]], trap: [[0, -1]] }, { say: "By yourself: the focus F is (0, −1) and the directrix is y = 3. Tap the vertex.", given: [[0, -1, "F"]], segs: [[-4, 3, 4, 3]], ans: [[0, 1]], trap: [[0, 3]] }, { say: "By yourself: the focus F is (1, 4) and the directrix is y = 0. Tap the vertex.", given: [[1, 4, "F"]], segs: [[-4, 0, 4, 0]], ans: [[1, 2]], trap: [[1, 0]] }] },
  ],
}));
