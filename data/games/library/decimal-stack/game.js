// Decimal Stack. Skill 6.NS.B.3-1.
// Fluently adding and subtracting multi-digit decimals. Misaligning the decimal points is the known slip.
Sidekick.game(Sidekick.play({
  title: "Decimal Stack",
  emoji: "🧾",
  premise: "Adding a column of decimals works only when the decimal points sit in one straight line.",
  outro: "Line up the decimal points and fill empty places with zeros.",
  scene: "city",
  kind: "type",
  icon: "🧾",
  hint: "Write each number with the same number of decimal places first.",
  tag: "misaligns_points",
  rounds: [
    { say: "Key in the sum.", q: "12.5 + 3.75 + 0.8", ans: "17.05", trap: "5.08", why: "Line up the points: 12.50, 3.75 and 0.80.", win: "12.50 + 3.75 + 0.80 = 17.05." },
    { say: "Now subtract.", q: "20.4 − 6.85", ans: "13.55", trap: "13.65", why: "Write 20.40, then trade to subtract the hundredths.", win: "20.40 − 6.85 = 13.55." },
    { say: "Key in the answer by yourself.", alt: [{ q: "8.06 + 14.9 + 0.375", ans: "23.335", trap: "9.930" }, { q: "15 − 4.28", ans: "10.72", trap: "11.28" }, { q: "6.4 + 0.75 + 12", ans: "19.15", trap: "7.27" }] },
  ],
}));
