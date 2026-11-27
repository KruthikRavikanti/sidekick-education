// Half-Cube Packing. Skill 6.G.A.2-1.
// Packing a prism with fractional unit cubes. Thinking unit cubes must be whole is the known slip.
Sidekick.game(Sidekick.play({
  title: "Half-Cube Packing",
  emoji: "🧊",
  premise: "When a box has fraction edges, pack it with smaller cubes. Half-unit cubes fit along any edge measured in halves.",
  outro: "Unit cubes can have fraction edges. Count how many fit along each edge, then multiply.",
  scene: "snow",
  kind: "type",
  hint: "Two half-unit cubes fit in every 1 unit of length.",
  tag: "cubes_must_be_whole",
  rounds: [
    { say: "How many half-unit cubes fit along the edge? Key in a number and watch.", q: "An edge is 2{1/2} units long. Each cube is {1/2} unit.", view: { type: "tape", top: [2.5], rep: 0.5, names: ["edge", "cubes"] }, ans: 5, trap: 2, why: "Only 2 whole-unit cubes fit, but these cubes are half a unit. Keep going.", win: "5 half-unit cubes fill the edge exactly." },
    { say: "How many half-unit cubes fill the whole box?", q: "The box is 3 cubes long, 2 wide and 2 high.", fig: { type: "cubes", d: [3, 2, 2], v: [] }, ans: 12, trap: 7, why: "That adds the edges. Layers of cubes multiply: 3 × 2 × 2.", win: "3 × 2 × 2 = 12 small cubes." },
    { say: "Count the cubes by yourself.", alt: [{ q: "An edge is 3{1/2} units long. How many {1/2}-unit cubes fit along it?", ans: 7, trap: 3 }, { q: "An edge is 1{1/2} units long. How many {1/4}-unit cubes fit along it?", ans: 6, trap: 1 }, { q: "A box is 4 half-cubes long, 2 wide and 1 high. How many cubes fill it?", ans: 8, trap: 7 }] },
  ],
}));
