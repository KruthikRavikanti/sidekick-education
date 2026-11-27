// Three Factors, Three Zeros. Skill A-APR.B.3-1.
// Identifying zeros of polynomials from factored form. Keeping the sign shown in the factor is the known slip.
Sidekick.game(Sidekick.play({
  title: "Three Factors, Three Zeros",
  emoji: "🎯",
  premise: "A product is zero when one of its factors is zero. Each factor hands you one zero, with the sign flipped.",
  outro: "The factor (x − a) gives the zero x = a. The factor (x + a) gives x = −a.",
  scene: "paper",
  kind: "plot",
  cast: "",
  axes: [-4, 4, -2, 2],
  quiet: true,
  hint: "Ask of each factor: what x makes it zero?",
  tag: "keeps_factor_sign",
  rounds: [
    { say: "y = (x − 1)(x + 2). Tap the two points where the graph crosses the x-axis.", ans: [[1, 0], [-2, 0]], trap: [[-1, 0], [2, 0]], why: "x − 1 is zero at x = 1, and x + 2 is zero at x = −2. The signs flip.", win: "Zeros at 1 and −2." },
    { say: "y = (x + 3)(x − 2)(x − 4). Tap all three zeros.", ans: [[-3, 0], [2, 0], [4, 0]], trap: [[3, 0], [-2, 0], [-4, 0]], why: "Each factor is zero at the opposite of the number you see.", win: "Zeros at −3, 2 and 4." },
    { say: "Tap all the zeros by yourself.", alt: [{ say: "By yourself: tap all the zeros of y = (x − 3)(x + 1)(x + 4).", ans: [[3, 0], [-1, 0], [-4, 0]], trap: [[-3, 0], [1, 0], [4, 0]] }, { say: "By yourself: tap all the zeros of y = x(x − 2)(x + 3).", ans: [[0, 0], [2, 0], [-3, 0]], trap: [[0, 0], [-2, 0], [3, 0]] }, { say: "By yourself: tap all the zeros of y = (x + 2)(x − 4)(x − 1).", ans: [[-2, 0], [4, 0], [1, 0]], trap: [[2, 0], [-4, 0], [-1, 0]] }] },
  ],
}));
