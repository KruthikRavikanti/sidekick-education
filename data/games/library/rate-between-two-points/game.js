// Rate Between Two Points. Skill F-IF.B.6-2.
// Estimating the rate of change from a graph. Using a single point is the known slip.
Sidekick.game(Sidekick.play({
  title: "Rate Between Two Points",
  emoji: "🪜",
  premise: "On a curve, the rate of change keeps shifting. Between two marked points you can still estimate an average.",
  outro: "Estimate the average rate of change from a graph with rise over run between two points.",
  scene: "paper",
  kind: "type",
  hint: "You need two points. How far up, for how far across?",
  tag: "uses_single_point",
  rounds: [
    { say: "Key in the average rate of change between the two marked points.", fig: { type: "graph", fn: "quad", pre: [0.5, 0, 2], dots: [[0, 2, "(0, 2)"], [4, 10, "(4, 10)"]], win: [-1, 5, 0, 12], h: 50, v: [] }, ans: 2, trap: 10, why: "10 is one y-value. Use both points: up 8 for 4 across.", win: "8 ÷ 4 = 2." },
    { say: "Key in the average rate of change between these points.", fig: { type: "graph", fn: "quad", pre: [1, 0, 2], dots: [[1, 3, "(1, 3)"], [3, 11, "(3, 11)"]], win: [-1, 5, 0, 12], h: 50, v: [] }, ans: 4, trap: 11, why: "Use both points: up 8 for 2 across.", win: "8 ÷ 2 = 4." },
    { say: "Find it by yourself.", alt: [{ q: "A graph passes through (0, 1) and (2, 9).", ans: 4, trap: 9 }, { q: "A graph passes through (1, 2) and (5, 14).", ans: 3, trap: 14 }, { q: "A graph passes through (2, 5) and (6, 13).", ans: 2, trap: 13 }] },
  ],
}));
