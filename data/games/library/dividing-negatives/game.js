// Dividing Negatives. Skill 7.NS.A.2-2.
// Dividing integers and understanding that the quotient is a rational number. Thinking a negative cannot be divided is the known slip.
Sidekick.game(Sidekick.play({
  title: "Dividing Negatives",
  emoji: "➗",
  premise: "Negative numbers can be divided just like positives. Sharing a debt of 36 among 9 people gives each a debt of 4.",
  outro: "Division follows the same sign rules as multiplication.",
  scene: "desk",
  kind: "type",
  icon: "➗",
  hint: "Divide the numbers. Then: same signs positive, different signs negative.",
  tag: "cannot_divide_negative",
  rounds: [
    { say: "Key in the quotient.", q: "−36 ÷ 9", ans: -4, trap: 4, why: "The signs are different, so the quotient is negative.", win: "−36 ÷ 9 = −4." },
    { say: "Key in the quotient.", q: "−48 ÷ −6", ans: 8, trap: -8, why: "The signs match, so the quotient is positive.", win: "−48 ÷ −6 = 8." },
    { say: "Key in the quotient by yourself.", alt: [{ q: "45 ÷ −5", ans: -9, trap: 9 }, { q: "−56 ÷ −8", ans: 7, trap: -7 }, { q: "−30 ÷ 6", ans: -5, trap: 5 }] },
  ],
}));
