// Zero Holds the Place. Skill 6.NS.B.2-1.
// Fluently dividing multi-digit numbers with the standard algorithm. Forgetting placeholder zeros in the quotient is the known slip.
Sidekick.game(Sidekick.play({
  title: "Zero Holds the Place",
  emoji: "🧮",
  premise: "In long division, when the divisor does not fit into a place, that place still needs a digit: zero.",
  outro: "Write a 0 in the quotient whenever the divisor does not go into the next part.",
  scene: "desk",
  kind: "type",
  icon: "🧮",
  hint: "After you bring down a digit, if the divisor is too big, write 0 and bring down again.",
  tag: "drops_zero_in_quotient",
  rounds: [
    { say: "Key in the quotient.", q: "7,548 ÷ 12", ans: 629, trap: 62, why: "12 × 62 is only 744. The quotient needs three digits.", win: "7,548 ÷ 12 = 629." },
    { say: "Watch the tens place.", q: "7,224 ÷ 12", ans: 602, trap: 62, why: "12 does not go into 2, so a 0 holds the tens place.", win: "7,224 ÷ 12 = 602." },
    { say: "Key in the quotient by yourself.", alt: [{ q: "8,160 ÷ 16", ans: 510, trap: 51 }, { q: "9,045 ÷ 15", ans: 603, trap: 63 }, { q: "6,030 ÷ 30", ans: 201, trap: 21 }] },
  ],
}));
