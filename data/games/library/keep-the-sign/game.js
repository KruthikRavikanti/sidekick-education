// Keep the Sign. Skill 7.NS.A.2-3.
// Applying properties of operations to multiply and divide rational numbers. Losing signs when distributing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Keep the Sign",
  emoji: "🪢",
  premise: "When a negative number multiplies a bracket, it multiplies every term inside, sign and all.",
  outro: "Distribute the negative to every term: −2(3 − 5) = −6 + 10.",
  scene: "desk",
  kind: "type",
  icon: "🪢",
  hint: "Multiply −2 by each term. A negative times a negative is positive.",
  tag: "loses_sign_distributing",
  rounds: [
    { say: "Key in the value.", q: "−2(3 − 5)", ans: 4, trap: -16, why: "−2 × −5 is +10, not −10. So it is −6 + 10.", win: "−6 + 10 = 4." },
    { say: "Key in the value.", q: "−3(4 − 6)", ans: 6, trap: -30, why: "−3 × −6 is +18. So it is −12 + 18.", win: "−12 + 18 = 6." },
    { say: "Key in the value by yourself.", alt: [{ q: "−5(2 − 4)", ans: 10, trap: -30 }, { q: "−2(−3 + 1)", ans: 4, trap: 8 }, { q: "−4(1 − 3)", ans: 8, trap: -16 }] },
  ],
}));
