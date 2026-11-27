// Same Solution, New Equation. Skill A-REI.C.5-1.
// Proving that replacing one equation by the sum of that equation and a multiple of the other produces a system with the same solutions. Multiplying only one side is the known slip.
Sidekick.game(Sidekick.play({
  title: "Same Solution, New Equation",
  emoji: "♻️",
  premise: "Doubling an equation or adding two equations makes a new equation with the same solution, as long as every term is treated the same.",
  outro: "Replacing one equation by its sum with a multiple of the other keeps the same solutions.",
  scene: "desk",
  kind: "sort",
  fs: 5.6,
  hint: "Put x = 3 and y = 2 in. Is the new equation still true?",
  tag: "multiplies_one_side",
  rounds: [
    { say: "x + y = 5 and x − y = 1 have the solution (3, 2). Which new equations are still true there?", bins: "Still true|No longer true", items: ["2x + 2y = 10|2x = 6|3x + y = 11", "2x + y = 10|x + 2y = 5"], trap: ["2x + y = 10", 0], why: "Only part of x + y = 5 was doubled. Every term must be multiplied.", win: "Fair operations keep the solution." },
    { say: "Where does each new equation come from?", kind: "fill", fs: 5.2, cast: "", rows: [["double x + y = 5", "2x + 2y = 10"], ["add x + y = 5 and x − y = 1", "2x = 6"], ["the solution is still", "(3, 2)"]], extra: "2x + y = 10|", trap: [0, "2x + y = 10"], why: "Doubling must hit the y as well.", win: "Scale every term. Add whole equations." },
    { say: "x + y = 7 and x − y = 3 have the solution (5, 2). Sort by yourself.", bins: "Still true|No longer true", items: ["3x + 3y = 21|2x = 10", "3x + y = 21|x + 3y = 7|2x = 4"], trap: ["3x + y = 21", 0] },
  ],
}));
