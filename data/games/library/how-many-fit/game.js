// How Many Fit?. Skill 5.NBT.B.7-3.
// Dividing decimals: 7.2 ÷ 0.8 = 9, shown as copies of 0.8 laid along 7.2. Ignoring the decimal in the divisor (0.9) is the known slip.
Sidekick.game(Sidekick.play({
  title: "How Many Fit?",
  emoji: "🧵",
  premise: "Dividing by a decimal asks how many of that small piece fit. Lots of small pieces can fit in a short length.",
  outro: "Dividing by a number less than 1 gives an answer bigger than what you started with.",
  scene: "candy",
  kind: "type",
  hint: "How many pieces of that size fit along the whole length?",
  tag: "ignores_decimal_in_divisor",
  rounds: [
    { say: "How many pieces of 0.8 fit along 7.2? Key in a number and watch.", q: "7.2 ÷ 0.8", view: { type: "tape", top: [7.2], rep: 0.8, names: ["whole", "pieces"] }, ans: "9", trap: "0.9", why: "A piece of 0.8 is small. Many of them fit into 7.2.", win: "7.2 ÷ 0.8 = 9." },
    { say: "How many pieces of 0.5 fit along 4.5?", q: "4.5 ÷ 0.5", view: { type: "tape", top: [4.5], rep: 0.5, names: ["whole", "pieces"] }, ans: "9", trap: "0.9", why: "Two halves fit in every 1, so many fit in 4.5.", win: "4.5 ÷ 0.5 = 9." },
    { say: "Key in the answer by yourself.", alt: [{ q: "6.3 ÷ 0.7", ans: "9", trap: "0.9" }, { q: "2.4 ÷ 0.06", ans: "40", trap: "4" }, { q: "5.6 ÷ 0.8", ans: "7", trap: "0.7" }] },
  ],
}));
