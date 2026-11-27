// Shift Both Points. Skill 6.NS.B.3-3.
// Dividing multi-digit decimals, including by a decimal divisor. Not shifting the decimal in both numbers is the known slip.
Sidekick.game(Sidekick.play({
  title: "Shift Both Points",
  emoji: "➗",
  premise: "To divide by a decimal, slide the point in the divisor until it is a whole number. Slide the other point the same way.",
  outro: "Move the decimal point the same number of places in both numbers, then divide.",
  scene: "desk",
  kind: "type",
  icon: "➗",
  hint: "Multiply both numbers by 10 or 100 so the divisor is whole.",
  tag: "shifts_only_one_point",
  rounds: [
    { say: "Key in the quotient.", q: "7.2 ÷ 0.06", ans: "120", trap: "1.2", why: "Shift both points two places: 720 ÷ 6.", win: "720 ÷ 6 = 120." },
    { say: "Key in this quotient.", q: "4.5 ÷ 0.5", ans: "9", trap: "0.9", why: "Shift both points one place: 45 ÷ 5.", win: "45 ÷ 5 = 9." },
    { say: "Key in the quotient by yourself.", alt: [{ q: "6.4 ÷ 0.08", ans: "80", trap: "0.8" }, { q: "1.44 ÷ 1.2", ans: "1.2", trap: "12" }, { q: "9.6 ÷ 0.3", ans: "32", trap: "3.2" }] },
  ],
}));
