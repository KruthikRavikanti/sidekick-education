// Multiply to Check. Skill 6.NS.B.2-2.
// Checking quotients with multiplication. Not checking is the known slip.
Sidekick.game(Sidekick.play({
  title: "Multiply to Check",
  emoji: "✅",
  premise: "Every division can be checked. Multiply the answer by the divisor and you should get back where you started.",
  outro: "Check a quotient by multiplying: quotient × divisor = dividend.",
  scene: "desk",
  kind: "sort",
  hint: "Multiply the answer by the number you divided by. Do you get the first number?",
  tag: "does_not_check",
  rounds: [
    { say: "Check each division by multiplying. Is it correct?", bins: "Checks out|Does not", items: ["84 ÷ 7 = 12|96 ÷ 8 = 12", "91 ÷ 7 = 12|108 ÷ 8 = 12"], trap: ["91 ÷ 7 = 12", 0], why: "12 × 7 is 84, not 91.", win: "Multiplying back catches the slips." },
    { say: "Check these.", bins: "Checks out|Does not", items: ["180 ÷ 15 = 12|225 ÷ 25 = 9", "195 ÷ 15 = 12|250 ÷ 25 = 9"], trap: ["250 ÷ 25 = 9", 0], why: "9 × 25 is 225, not 250.", win: "Each one checked by multiplying." },
    { say: "Check these by yourself.", bins: "Checks out|Does not", items: ["7,548 ÷ 12 = 629|2,010 ÷ 15 = 134", "3,024 ÷ 24 = 136|4,500 ÷ 36 = 135"], trap: ["3,024 ÷ 24 = 136", 0] },
  ],
}));
