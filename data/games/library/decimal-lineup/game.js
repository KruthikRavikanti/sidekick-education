// Decimal Lineup. Skill 4.NF.C.7-1.
// Comparing decimals to hundredths by reasoning about size: 0.5 is greater than 0.25. Thinking longer decimals are greater is the known slip.
Sidekick.game(Sidekick.play({
  title: "Decimal Lineup",
  emoji: "🐧",
  premise: "The penguins line up from least to greatest. A longer decimal is not always a bigger one.",
  outro: "Compare decimals place by place: tenths first, then hundredths.",
  scene: "snow",
  kind: "row",
  fs: 6,
  hint: "Give every number two decimal places: 0.5 is 0.50.",
  tag: "longer_is_greater",
  rounds: [
    { say: "Put the decimals in order from least to greatest.", seq: "0.25 0.5 0.8", trap: "0.5 0.8 0.25", why: "0.25 has more digits, but it is only 25 hundredths. 0.5 is 50 hundredths.", win: "0.25, then 0.50, then 0.80." },
    { say: "Line up four decimals from least to greatest.", seq: "0.09 0.3 0.45 0.7", trap: "0.3 0.7 0.09 0.45", why: "0.09 is only 9 hundredths. 0.3 is 30 hundredths.", win: "0.09, 0.30, 0.45, 0.70." },
    { say: "Line these up by yourself.", alt: [{ seq: "0.07 0.4 0.52 0.9", trap: "0.4 0.9 0.07 0.52" }, { seq: "0.08 0.2 0.61 0.7", trap: "0.2 0.7 0.08 0.61" }] },
  ],
}));
