// Distribute, Combine, Solve. Skill 8.EE.C.7-3.
// Solving equations that need the distributive property and combining like terms. Distributing to one term only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Distribute, Combine, Solve",
  emoji: "🧩",
  premise: "Longer equations need tidying first. Multiply through the brackets, gather like terms, and then solve.",
  outro: "Distribute to every term, combine like terms, then isolate x.",
  scene: "desk",
  kind: "type",
  icon: "🧩",
  hint: "The number outside multiplies EVERY term in the bracket.",
  tag: "distributes_to_one_term",
  rounds: [
    { say: "Key in the value of x.", q: "3(x − 2) + 4 = 2x + 5", ans: 7, trap: 3, why: "3 × −2 is −6, not −2. So 3x − 6 + 4 = 2x + 5.", win: "3x − 2 = 2x + 5, so x = 7." },
    { say: "Key in the value of x.", q: "2(x + 3) = x + 10", ans: 4, trap: 7, why: "2 × 3 is 6. So 2x + 6 = x + 10.", win: "x = 4." },
    { say: "Solve by yourself.", alt: [{ q: "2(x − 3) + 5 = x + 4", ans: 5, trap: 2 }, { q: "3(x + 2) = x + 14", ans: 4, trap: 6 }, { q: "5(x − 2) = 3x + 4", ans: 7, trap: 3 }] },
  ],
}));
