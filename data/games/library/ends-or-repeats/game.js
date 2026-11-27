// Ends or Repeats?. Skill 7.NS.A.2-4.
// Converting a rational number to a decimal using long division, and knowing it terminates or repeats. Thinking one third is exactly 0.3 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Ends or Repeats?",
  emoji: "🔂",
  premise: "Divide the upper number by the lower one. Some decimals stop. Others repeat the same digits forever.",
  outro: "Every fraction becomes a decimal that either ends or repeats. One third is 0.333..., not 0.3.",
  scene: "space",
  kind: "sort",
  fs: 7,
  hint: "Do the division. Does the remainder ever reach zero?",
  tag: "third_is_point_three",
  rounds: [
    { say: "Does each decimal end or repeat?", bins: "Ends|Repeats", items: ["{1/4}|{1/2}|{3/8}", "{1/3}|{2/9}"], trap: ["{1/3}", 0], why: "1 ÷ 3 gives 0.333... and the 3s never stop.", win: "Thirds and ninths repeat." },
    { say: "Match each fraction to its decimal.", kind: "fill", fs: 6, cast: "", rows: [["{1/3}", "0.333..."], ["{1/4}", "0.25"], ["{2/3}", "0.666..."]], extra: "0.3", trap: [0, "0.3"], why: "0.3 is three tenths, a little less than one third.", win: "The dots show the digits repeat." },
    { say: "Sort these by yourself.", bins: "Ends|Repeats", items: ["{1/5}|{3/4}|{1/8}", "{1/6}|{5/9}"], trap: ["{1/6}", 0] },
  ],
}));
