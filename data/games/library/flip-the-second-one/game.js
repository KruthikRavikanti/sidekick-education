// Flip the Second One. Skill 6.NS.A.1-2.
// Computing quotients of fractions. Flipping the first fraction or both fractions is the known slip.
Sidekick.game(Sidekick.play({
  title: "Flip the Second One",
  emoji: "🔃",
  premise: "To divide by a fraction, multiply by its flip. Only the second fraction, the one you divide by, gets flipped.",
  outro: "Dividing by a fraction is multiplying by its reciprocal: flip the divisor only.",
  scene: "desk",
  kind: "type",
  icon: "🔃",
  hint: "Keep the first fraction. Flip the second. Then multiply.",
  tag: "flips_the_other_fraction",
  rounds: [
    { say: "Key in the quotient as a fraction.", q: "{2/3} ÷ {3/4}", ans: "8/9", trap: "9/8", trap2: "6/12", why: "That flipped the first fraction. Only the second one flips.", why2: "That multiplied without flipping anything.", win: "2 thirds × 4 thirds = 8 ninths." },
    { say: "Key in this quotient.", q: "{1/2} ÷ {1/4}", ans: "2", trap: "1/8", why: "How many quarters fit in a half? More than one.", win: "One half × 4 = 2." },
    { say: "Key in the quotient by yourself.", alt: [{ q: "{3/5} ÷ {2/3}", ans: "9/10", trap: "10/9" }, { q: "{3/4} ÷ {1/8}", ans: "6", trap: "3/32" }, { q: "{2/5} ÷ {3/4}", ans: "8/15", trap: "15/8" }] },
  ],
}));
