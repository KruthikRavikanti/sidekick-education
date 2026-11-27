// Line or Curve?. Skill 8.F.A.3-1.
// Interpreting y = mx + b as defining a linear function whose graph is a straight line. Thinking y = x² is linear is the known slip.
Sidekick.game(Sidekick.play({
  title: "Line or Curve?",
  emoji: "〰️",
  premise: "An equation of the form y = mx + b always graphs as a straight line. An x with an exponent bends the graph.",
  outro: "y = mx + b is linear. Equations with x², x³ or x in a denominator are not.",
  scene: "paper",
  kind: "sort",
  fs: 5.6,
  hint: "Is x just multiplied by a number and added to? Or is it squared?",
  tag: "square_is_linear",
  rounds: [
    { say: "Does each equation graph as a straight line?", bins: "Linear|Not linear", items: ["y = 2x + 3|y = −x|y = 5", "y = x^2|y = x^3"], trap: ["y = x^2", 0], why: "For x = 1, 2, 3 it gives 1, 4, 9. The jumps are not equal, so it curves.", win: "Only mx + b makes a line." },
    { say: "Sort these tables.", fs: 4.8, bins: "Linear|Not linear", items: ["x: 1, 2, 3 · y: 2, 4, 6|x: 0, 1, 2 · y: 5, 8, 11", "x: 1, 2, 3 · y: 1, 4, 9|x: 1, 2, 3 · y: 2, 4, 8"], trap: ["x: 1, 2, 3 · y: 2, 4, 8", 0], why: "The jumps are 2 then 4. Equal steps in x need equal jumps in y.", win: "Equal jumps make a line." },
    { say: "Sort these by yourself.", bins: "Linear|Not linear", items: ["y = 4x − 1|y = {1/2}x", "y = x^3|y = x^2 + 1"], trap: ["y = x^2 + 1", 0] },
  ],
}));
