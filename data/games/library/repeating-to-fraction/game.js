// Repeating to Fraction. Skill 8.NS.A.1-2.
// Converting a repeating decimal into a fraction. Thinking repeating decimals are irrational (or equal to tenths) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Repeating to Fraction",
  emoji: "🔁",
  premise: "Every repeating decimal is a fraction in disguise. One digit repeating forever is that digit over 9.",
  outro: "A repeating decimal is rational: 0.333... is one third, and 0.777... is seven ninths.",
  scene: "desk",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "One repeating digit sits over 9. Then simplify.",
  tag: "repeating_as_tenths",
  rounds: [
    { say: "Match each repeating decimal to its fraction.", rows: [["0.333...", "{1/3}"], ["0.666...", "{2/3}"], ["0.111...", "{1/9}"]], extra: "{3/10}", trap: [0, "{3/10}"], why: "Three tenths is 0.3 and stops. 0.333... keeps going and equals one third.", win: "Ninths and thirds." },
    { say: "Match these.", rows: [["0.444...", "{4/9}"], ["0.555...", "{5/9}"], ["0.1666...", "{1/6}"]], extra: "{4/10}", trap: [0, "{4/10}"], why: "Four tenths is 0.4 exactly. The repeating one is four ninths.", win: "One repeating digit goes over 9." },
    { say: "Match these by yourself.", rows: [["0.222...", "{2/9}"], ["0.888...", "{8/9}"], ["0.333...", "{1/3}"]], extra: "{2/10} {8/10}", trap: [0, "{2/10}"] },
  ],
}));
