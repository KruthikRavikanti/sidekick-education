// Difference of Squares Spotter. Skill A-SSE.A.2-1.
// Using the structure of an expression to rewrite it, such as seeing x⁴ − y⁴ as a difference of squares. Not seeing structure is the known slip.
Sidekick.game(Sidekick.play({
  title: "Difference of Squares Spotter",
  emoji: "🔲",
  premise: "Any square minus another square splits into a sum times a difference. Spot the pattern even when it is in disguise.",
  outro: "a² − b² = (a + b)(a − b). So x⁴ − y⁴ is (x² + y²)(x² − y²).",
  scene: "paper",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "What is being squared in each term? Call them a and b.",
  tag: "does_not_see_structure",
  rounds: [
    { say: "Factor each difference of squares.", rows: [["x^2 − 9", "(x + 3)(x − 3)"], ["x^4 − y^4", "(x^2 + y^2)(x^2 − y^2)"]], extra: "(x − 3)^2|", trap: [0, "(x − 3)^2"], why: "(x − 3)^2 has a middle term, −6x. A difference of squares has none.", win: "Sum times difference." },
    { say: "Factor these.", rows: [["4x^2 − 25", "(2x + 5)(2x − 5)"], ["x^2 − 1", "(x + 1)(x − 1)"], ["a^2 − b^2", "(a + b)(a − b)"]], extra: "(2x − 5)^2|", trap: [0, "(2x − 5)^2"], why: "4x^2 is (2x)^2 and 25 is 5^2. Use sum times difference.", win: "The same pattern three times." },
    { say: "Factor these by yourself.", rows: [["9x^2 − 16", "(3x + 4)(3x − 4)"], ["x^4 − 1", "(x^2 + 1)(x^2 − 1)"], ["x^2 − 49", "(x + 7)(x − 7)"]], extra: "(x − 7)^2|(3x − 4)^2", trap: [2, "(x − 7)^2"] },
  ],
}));
