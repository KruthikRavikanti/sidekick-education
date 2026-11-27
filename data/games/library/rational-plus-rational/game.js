// Rational Plus Rational. Skill N-RN.B.3-1.
// Explaining why the sum or product of two rational numbers is rational. Not being able to justify it with a general argument is the known slip.
Sidekick.game(Sidekick.play({
  title: "Rational Plus Rational",
  emoji: "➕",
  premise: "Add two fractions and you always get another fraction. The rational numbers never leak out under addition or multiplication.",
  outro: "The sum or product of two rational numbers is rational: {a/b} + {c/d} = {ad + bc/bd}.",
  scene: "desk",
  kind: "sort",
  fs: 6,
  hint: "Can the result be written as a whole number over a whole number?",
  tag: "no_general_argument",
  rounds: [
    { say: "Is each result rational or irrational?", bins: "Rational|Irrational", items: ["{1/2} + {1/3}|0.75 + 2|{2/5} × {1/3}", "√2 + 1|π + 3"], trap: ["{2/5} × {1/3}", 1], why: "It equals 2 fifteenths, a fraction of whole numbers.", win: "Rational with rational stays rational." },
    { say: "Build the general argument.", kind: "fill", fs: 5.6, cast: "", rows: [["{a/b} + {c/d} =", "{ad + bc/bd}"], ["ad + bc and bd are", "integers"], ["so the sum is", "rational"]], extra: "{a + c/b + d}|", trap: [0, "{a + c/b + d}"], why: "You cannot add across. Use the common denominator bd.", win: "An integer over an integer is rational." },
    { say: "Sort these by yourself.", bins: "Rational|Irrational", items: ["{3/4} − {1/8}|1.5 × 4|{7/2} + 0.25", "√3 + 2|π × 2"], trap: ["1.5 × 4", 1] },
  ],
}));
