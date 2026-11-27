// Graph to Solve. Skill 8.EE.C.8-2.
// Solving systems of two linear equations by graphing. Reading the intersection inaccurately is the known slip.
Sidekick.game(Sidekick.play({
  title: "Graph to Solve",
  emoji: "📉",
  premise: "To solve a system by graphing, draw both lines carefully and read where they cross.",
  outro: "Graph both equations. The crossing point is the solution: read x first, then y.",
  scene: "paper",
  kind: "plot",
  cast: "",
  axes: [0, 8, 0, 8],
  quiet: true,
  hint: "Follow the crossing point down to the x-axis and across to the y-axis.",
  tag: "misreads_intersection",
  rounds: [
    { say: "The blue line is y = x + 1. Set the orange line to y = −x + 5.", kind: "dial", view: { type: "graph", fn: "line", also: [["line", 1, 1]], win: [-1, 7, -1, 7] }, dials: [["Slope", -3, 3, 1, 1], ["Intercept", 0, 6, 1, 2]], ans: [-1, 5], trap: [1, 5], why: "The slope is −1, so the line goes downhill.", win: "The two lines cross at (2, 3)." },
    { say: "Tap the point where the two lines cross.", segs: [[0, 1, 7, 8], [0, 5, 5, 0]], ans: [[2, 3]], trap: [[3, 2]], why: "Read x first: the crossing is above 2, at height 3.", win: "The solution is (2, 3)." },
    { say: "Tap the crossing point by yourself.", alt: [{ segs: [[0, 2, 6, 8], [0, 6, 6, 0]], ans: [[2, 4]], trap: [[4, 2]] }, { segs: [[0, 3, 5, 8], [1, 8, 8, 1]], ans: [[3, 6]], trap: [[6, 3]] }] },
  ],
}));
