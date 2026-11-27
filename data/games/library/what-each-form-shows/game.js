// What Each Form Shows. Skill F-IF.C.8-1.
// Using factoring and completing the square to show zeros, extreme values and symmetry. Misreading the sign in the vertex is the known slip.
Sidekick.game(Sidekick.play({
  title: "What Each Form Shows",
  emoji: "🔍",
  premise: "One quadratic can be written three ways. Factored form shows the zeros. Vertex form shows the turning point.",
  outro: "Factored form reveals zeros. Vertex form (x − h)² + k reveals the vertex (h, k).",
  scene: "paper",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "In (x − 3)², the 3 is the x-coordinate of the vertex. The sign flips.",
  tag: "misreads_vertex_sign",
  rounds: [
    { say: "Rewrite f(x) = x^2 − 6x + 5 in two forms.", rows: [["factored form", "(x − 1)(x − 5)"], ["vertex form", "(x − 3)^2 − 4"]], extra: "(x + 3)^2 − 4|", trap: [1, "(x + 3)^2 − 4"], why: "Half of −6 is −3, so the bracket is (x − 3).", win: "Same function, two useful forms." },
    { say: "What does each form reveal?", rows: [["(x − 1)(x − 5) shows", "zeros at 1 and 5"], ["(x − 3)^2 − 4 shows", "vertex at (3, −4)"]], extra: "vertex at (−3, −4)|", trap: [1, "vertex at (−3, −4)"], why: "(x − 3) is zero when x is 3. The vertex is at x = 3.", win: "Zeros from one form, vertex from the other." },
    { say: "For f(x) = x^2 + 2x − 8, match by yourself.", rows: [["factored form", "(x + 4)(x − 2)"], ["vertex form", "(x + 1)^2 − 9"], ["vertex", "(−1, −9)"]], extra: "(1, −9)|", trap: [2, "(1, −9)"] },
  ],
}));
