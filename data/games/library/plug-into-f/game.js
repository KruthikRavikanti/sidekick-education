// Plug Into f. Skill F-IF.A.2-1.
// Using function notation and evaluating functions for inputs in their domains. Reading f(3) as f times 3 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Plug Into f",
  emoji: "🔌",
  premise: "f(3) is not f times 3. It means: put 3 in place of x and work out the result.",
  outro: "To evaluate f(a), substitute a for every x and follow the order of operations.",
  scene: "desk",
  kind: "type",
  icon: "🔌",
  hint: "Replace every x with the input. Do powers before multiplying.",
  tag: "f_times_three",
  rounds: [
    { say: "Key in the value.", q: "f(x) = 2x^2 − 1. Find f(3).", ans: 17, trap: 35, why: "Square the 3 first: 2 × 9 − 1. Do not square the 6.", win: "2 × 9 − 1 = 17." },
    { say: "Key in the value.", q: "g(x) = 5 − 3x. Find g(−2).", ans: 11, trap: -1, why: "−3 × −2 is +6. So 5 + 6.", win: "5 + 6 = 11." },
    { say: "Evaluate by yourself.", alt: [{ q: "f(x) = x^2 + 2x. Find f(4).", ans: 24, trap: 16 }, { q: "f(x) = 3x − 7. Find f(5).", ans: 8, trap: 15 }, { q: "f(x) = 10 − x^2. Find f(3).", ans: 1, trap: 4 }] },
  ],
}));
