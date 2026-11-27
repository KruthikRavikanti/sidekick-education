// Tenths Times Tenths. Skill 5.NBT.B.7-2.
// Multiplying decimals: 0.6 × 0.4 = 0.24, shown on a hundred grid. Placing the decimal point by lining it up (2.4) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tenths Times Tenths",
  emoji: "🧇",
  premise: "A waffle of 100 squares shows what happens when tenths multiply tenths: you get hundredths.",
  outro: "Tenths times tenths are hundredths, so the product has two decimal places.",
  scene: "kitchen",
  kind: "type",
  icon: "🧇",
  hint: "Tenths times tenths make hundredths. How many hundredths?",
  tag: "lines_up_the_point",
  rounds: [
    { say: "Paint a rectangle 0.6 wide and 0.4 tall: 6 columns by 4 rows.", kind: "paint", cast: "", grid: [10, 10], rect: [6, 4], strict: true, noun: "Hundredths", trap: [6, 10], why: "That is 0.6 of the whole waffle. Only 4 rows tall, for 0.4.", win: "0.6 × 0.4 covers 24 hundredths: 0.24." },
    { say: "Key in the product.", q: "0.6 × 0.4", ans: "0.24", trap: "2.4", why: "Both numbers are less than 1, so the product must be less than 1 too.", win: "0.6 × 0.4 = 0.24." },
    { say: "Key in the product by yourself.", alt: [{ q: "0.3 × 0.5", ans: "0.15", trap: "1.5" }, { q: "0.7 × 0.8", ans: "0.56", trap: "5.6" }, { q: "1.2 × 0.4", ans: "0.48", trap: "4.8" }] },
  ],
}));
