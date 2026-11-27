// Why the Point Goes There. Skill 5.NBT.B.7-4.
// Explaining decimal multiplication with models and place-value language: 3 tenths × 2 tenths = 6 hundredths. Not being able to justify where the point goes is the known slip.
Sidekick.game(Sidekick.play({
  title: "Why the Point Goes There",
  emoji: "💡",
  premise: "Say the decimals as tenths and hundredths, and it is clear where the decimal point has to go.",
  outro: "Tenths × tenths = hundredths. Tenths × ones = tenths.",
  scene: "paper",
  kind: "fill",
  cast: "",
  hint: "Say it in words: tenths times tenths gives hundredths.",
  tag: "cannot_place_the_point",
  rounds: [
    { say: "Paint a rectangle 3 tenths wide and 2 tenths tall. Each small square is one hundredth.", kind: "paint", grid: [10, 10], rect: [3, 2], strict: true, noun: "Hundredths", trap: [3, 10], why: "Only 2 rows tall. The rectangle is 3 tenths by 2 tenths.", win: "3 tenths × 2 tenths covers 6 hundredths: 0.06." },
    { say: "Finish each line.", rows: [["5 tenths × 7 tenths = 35 ___", "hundredths"], ["0.5 × 0.7 = ___", "0.35"], ["4 tenths × 2 = 8 ___", "tenths"]], extra: "3.5", trap: [1, "3.5"], why: "35 hundredths is 0.35. It must be less than 1.", win: "Hundredths, 0.35 and tenths." },
    { say: "Finish these by yourself.", rows: [["4 tenths × 6 tenths = 24 ___", "hundredths"], ["0.4 × 0.6 = ___", "0.24"], ["0.4 × 6 = ___", "2.4"]], extra: "tenths 0.024", trap: [1, "2.4"] },
  ],
}));
