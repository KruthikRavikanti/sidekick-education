// Ten Times, Every Step. Skill 5.NBT.A.1-1.
// A digit in one place represents 10 times what it represents in the place to its right, including across the decimal point. Thinking the relationship stops at the decimal point is the known slip.
Sidekick.game(Sidekick.play({
  title: "Ten Times, Every Step",
  emoji: "🪜",
  premise: "Each step to the left on the place value ladder is worth ten times more. The ladder keeps going past the decimal point.",
  outro: "A digit is worth 10 times as much as the same digit one place to its right, on both sides of the decimal point.",
  scene: "city",
  kind: "fill",
  cast: "",
  hint: "Count how many places apart the digits are. Each place is ten times.",
  tag: "stops_at_the_decimal_point",
  rounds: [
    { say: "Finish each comparison.", rows: [["The 4 in 400 is ___ times the 4 in 40", "10"], ["The 4 in 4 is ___ times the 4 in 0.4", "10"]], extra: "1 100", trap: [1, "1"], why: "The pattern keeps going past the decimal point. Ones are 10 times tenths.", win: "Ten times, on both sides of the point." },
    { say: "Some of these are two places apart.", rows: [["0.6 is ___ times 0.06", "10"], ["6 is ___ times 0.06", "100"], ["600 is ___ times 6", "100"]], extra: "1 1,000", trap: [1, "10"], why: "From ones to hundredths is two places: 10 × 10.", win: "One place is 10 times. Two places is 100 times." },
    { say: "Finish these by yourself.", rows: [["0.7 is ___ times 0.07", "10"], ["7 is ___ times 0.07", "100"], ["70 is ___ times 7", "10"]], extra: "1 1,000", trap: [0, "1"] },
  ],
}));
