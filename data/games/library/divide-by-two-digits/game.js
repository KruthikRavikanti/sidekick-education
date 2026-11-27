// Divide by Two Digits. Skill 5.NBT.B.6-1.
// Dividing up to four-digit dividends by two-digit divisors. Misjudging or misplacing a quotient digit is the known slip.
Sidekick.game(Sidekick.play({
  title: "Divide by Two Digits",
  emoji: "🚚",
  premise: "Dividing by a two-digit number takes good guesses. Estimate each digit of the answer, then check by multiplying.",
  outro: "Estimate each digit, multiply to check, and keep each digit in its place.",
  scene: "city",
  kind: "type",
  icon: "🚚",
  hint: "Round the divisor to estimate. Then multiply back to check.",
  tag: "misplaces_quotient_digit",
  rounds: [
    { say: "Key in the answer.", q: "672 ÷ 16", ans: 42, trap: 402, why: "16 × 40 is 640. Only 32 is left, which is 2 more sixteens.", win: "672 ÷ 16 = 42." },
    { say: "A bigger one.", q: "1,944 ÷ 24", ans: 81, trap: 810, why: "24 × 810 would be over 19,000. Estimate first: about 2,000 ÷ 25.", win: "1,944 ÷ 24 = 81." },
    { say: "Key in the answer by yourself.", alt: [{ q: "1,105 ÷ 13", ans: 85, trap: 850 }, { q: "2,016 ÷ 32", ans: 63, trap: 630 }, { q: "3,128 ÷ 46", ans: 68, trap: 680 }] },
  ],
}));
