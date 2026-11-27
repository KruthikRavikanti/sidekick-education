// Line Up the Points. Skill 5.NBT.B.7-1.
// Adding and subtracting decimals to hundredths. Lining up the digits on the right instead of the decimal points is the known slip.
Sidekick.game(Sidekick.play({
  title: "Line Up the Points",
  emoji: "🎯",
  premise: "When adding decimals, the decimal points must line up so tenths meet tenths and ones meet ones.",
  outro: "Line up the decimal points, not the last digits.",
  scene: "desk",
  kind: "type",
  icon: "🎯",
  hint: "Write a zero so both numbers have the same number of places: 3.4 is 3.40.",
  tag: "lines_up_on_the_right",
  rounds: [
    { say: "Key in the sum.", q: "3.4 + 12.75", ans: "16.15", trap: "13.09", why: "3.4 is 3 and 4 tenths. Write it as 3.40 so the points line up.", win: "3.40 + 12.75 = 16.15." },
    { say: "Now subtract.", q: "8.5 − 2.36", ans: "6.14", trap: "6.26", why: "Write 8.5 as 8.50, then trade a tenth for 10 hundredths.", win: "8.50 − 2.36 = 6.14." },
    { say: "Key in the answer by yourself.", alt: [{ q: "4.7 + 23.18", ans: "27.88", trap: "23.65" }, { q: "15.2 + 6.45", ans: "21.65", trap: "7.97" }, { q: "9.3 − 4.75", ans: "4.55", trap: "4.65" }] },
  ],
}));
