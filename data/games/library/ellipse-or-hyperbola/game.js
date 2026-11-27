// Ellipse or Hyperbola. Skill G-GPE.A.3-1.
// Deriving the equations of ellipses and hyperbolas given the foci. Confusing the ellipse and hyperbola forms is the known slip.
Sidekick.game(Sidekick.play({
  title: "Ellipse or Hyperbola",
  emoji: "🥚",
  premise: "An ellipse keeps the sum of its two focus distances constant. A hyperbola keeps the difference constant. One sign tells them apart.",
  outro: "Plus between the squared terms: ellipse. Minus: hyperbola.",
  scene: "space",
  kind: "sort",
  fs: 5.4,
  hint: "Look at the sign between the x^2 term and the y^2 term.",
  tag: "confuses_conic_forms",
  rounds: [
    { say: "Sort the equations.", bins: "Ellipse|Hyperbola", items: ["{x^2/9} + {y^2/4} = 1|{x^2/16} + {y^2/25} = 1", "{x^2/9} − {y^2/4} = 1|{y^2/4} − {x^2/9} = 1"], trap: ["{x^2/9} − {y^2/4} = 1", 0], why: "A minus sign means the curve opens into two branches: a hyperbola.", win: "Plus closes the curve. Minus opens it." },
    { say: "Match each definition to its curve.", kind: "fill", fs: 4.8, cast: "", rows: [["the sum of the distances to two foci stays the same", "ellipse"], ["the difference of the distances to two foci stays the same", "hyperbola"]], extra: "parabola circle", trap: [0, "hyperbola"], why: "A fixed sum keeps the point close to both foci, on a closed oval.", win: "Sum: ellipse. Difference: hyperbola." },
    { say: "Sort these by yourself.", bins: "Ellipse|Hyperbola", items: ["{x^2/25} + {y^2/9} = 1|{x^2/4} + y^2 = 1", "{x^2/25} − {y^2/9} = 1|y^2 − {x^2/4} = 1"], trap: ["y^2 − {x^2/4} = 1", 0] },
  ],
}));
