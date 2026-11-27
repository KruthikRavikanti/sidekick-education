// Grid Artist. Skill K.G.B.5-2.
// Drawing shapes with the right sides: the child paints a rectangle or square to a given size on a grid, so the sides are straight and the corners square.
Sidekick.game(Sidekick.play({
  title: "Grid Artist",
  emoji: "🎨",
  premise: "Draw shapes on the grid with straight sides and square corners. Follow how far across and how far down.",
  outro: "Rectangles and squares have straight sides and four corners.",
  scene: "paper",
  kind: "paint",
  strict: true,
  noun: "Squares",
  cast: "",
  hint: "Count across first, then count down.",
  tag: "miscounts_a_side",
  grid: [6, 4],
  rounds: [
    { say: "Draw a rectangle: 4 across and 2 down.", rect: [4, 2], trap: [4, 3], why: "Count the rows going down. It should be 2.", win: "A rectangle, 4 across and 2 down." },
    { say: "Draw a square: 3 across and 3 down.", rect: [3, 3], trap: [3, 2], why: "A square is the same across and down.", win: "A square has all sides the same." },
    { say: "Draw this shape by yourself.", alt: [{ say: "Draw a rectangle: 5 across and 2 down.", rect: [5, 2], trap: [5, 3] }, { say: "Draw a square: 2 across and 2 down.", rect: [2, 2], trap: [2, 3] }, { say: "Draw a rectangle: 3 across and 4 down.", rect: [3, 4], trap: [3, 3] }] },
  ],
}));
