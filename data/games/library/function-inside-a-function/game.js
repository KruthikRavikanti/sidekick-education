// Function Inside a Function. Skill F-BF.A.1-3.
// Composing functions. Multiplying f and g instead of composing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Function Inside a Function",
  emoji: "🪆",
  premise: "f(g(3)) means: put 3 into g first, then put that answer into f. Work from the inside out.",
  outro: "To compose, evaluate the inner function first and feed its output to the outer one.",
  scene: "candy",
  kind: "type",
  icon: "🪆",
  hint: "Find the inside value first. Then use it as the input of the outside function.",
  tag: "multiplies_not_composes",
  rounds: [
    { say: "Key in f(g(3)).", q: "f(x) = 2x + 1 and g(x) = x^2", ans: 19, trap: 63, why: "That multiplied f(3) by g(3). Find g(3) = 9, then f(9).", win: "g(3) = 9, and f(9) = 19." },
    { say: "Now key in g(f(3)) for the same functions.", q: "f(x) = 2x + 1 and g(x) = x^2", ans: 49, trap: 19, why: "The order changed. Now f goes first: f(3) = 7, then g(7).", win: "f(3) = 7, and g(7) = 49." },
    { say: "Compose by yourself.", alt: [{ q: "f(x) = x + 4 and g(x) = 3x. Find f(g(2)).", ans: 10, trap: 36 }, { q: "f(x) = x^2 and g(x) = x − 1. Find f(g(5)).", ans: 16, trap: 100 }, { q: "f(x) = 2x and g(x) = x + 3. Find g(f(4)).", ans: 11, trap: 56 }] },
  ],
}));
