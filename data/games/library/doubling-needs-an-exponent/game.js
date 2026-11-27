// Doubling Needs an Exponent. Skill A-CED.A.1-2.
// Creating quadratic and exponential equations in one variable from situations. Using a linear form when the growth is exponential is the known slip.
Sidekick.game(Sidekick.play({
  title: "Doubling Needs an Exponent",
  emoji: "🦠",
  premise: "Adding the same amount each step is linear. Multiplying by the same factor each step is exponential. Choose the right kind of equation.",
  outro: "Repeated multiplying needs an exponent: 500 doubling each year is 500(2)^t.",
  scene: "night",
  kind: "fill",
  fs: 5,
  cast: "",
  hint: "Does it grow by adding the same amount, or by multiplying by the same factor?",
  tag: "linear_for_exponential",
  rounds: [
    { say: "Match each situation to its equation.", rows: [["500 doubles every year until it reaches 8,000", "500(2)^t = 8000"], ["500 gains 500 every year until it reaches 8,000", "500 + 500t = 8000"]], extra: "500(2t) = 8000|", trap: [0, "500 + 500t = 8000"], why: "Doubling multiplies by 2 each year. That needs 2 as a base with exponent t.", win: "Multiplying is exponential. Adding is linear." },
    { say: "Match these.", rows: [["a square of side x has area 49", "x^2 = 49"], ["10 bacteria triple each hour to reach 810", "10(3)^t = 810"], ["$100 halves each year down to $25", "100(0.5)^t = 25"]], extra: "10 + 3t = 810|", trap: [1, "10 + 3t = 810"], why: "Tripling means × 3 every hour, not + 3.", win: "A quadratic and two exponentials." },
    { say: "Match these by yourself.", rows: [["200 doubles each day until it reaches 3,200", "200(2)^t = 3200"], ["a rectangle x by x + 2 has area 24", "x(x + 2) = 24"]], extra: "200 + 2t = 3200|2x + 2 = 24", trap: [0, "200 + 2t = 3200"] },
  ],
}));
