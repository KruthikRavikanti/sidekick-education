// Stays a Polynomial. Skill A-APR.A.1-3.
// Understanding that polynomials are closed under addition, subtraction and multiplication. Thinking the result might not be a polynomial is the known slip.
Sidekick.game(Sidekick.play({
  title: "Stays a Polynomial",
  emoji: "🔒",
  premise: "Add, subtract or multiply polynomials and you always get a polynomial. Division is the one that can break out.",
  outro: "Polynomials are closed under addition, subtraction and multiplication, like the integers.",
  scene: "desk",
  kind: "sort",
  fs: 5.6,
  hint: "A polynomial has only whole-number powers of x, with no x underneath a fraction or a root.",
  tag: "doubts_closure",
  rounds: [
    { say: "Polynomial or not?", bins: "Polynomial|Not a polynomial", items: ["x^2 + 3x|(x + 1)(x − 2)|5", "{1/x}|√x"], trap: ["(x + 1)(x − 2)", 1], why: "Multiply it out: x^2 − x − 2. A product of polynomials is a polynomial.", win: "Products stay inside the family." },
    { say: "True or not true?", fs: 4.8, bins: "True|Not true", items: ["Polynomial + polynomial is a polynomial.|Polynomial × polynomial is a polynomial.", "Polynomial ÷ polynomial is always a polynomial.|Subtracting polynomials can create a square root."], trap: ["Polynomial ÷ polynomial is always a polynomial.", 0], why: "1 ÷ x is not a polynomial. Division can leave the family.", win: "Closed under three operations, not four." },
    { say: "Sort these by yourself.", bins: "Polynomial|Not a polynomial", items: ["3x^3 − x|x^2(x + 4)|x^2 − x^2", "{x + 1/x}|x^{-1}"], trap: ["x^2 − x^2", 1] },
  ],
}));
