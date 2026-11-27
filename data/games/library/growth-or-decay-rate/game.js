// Growth or Decay Rate. Skill F-IF.C.8-2.
// Interpreting the parameters of exponential functions to identify percent rate of change. Reading 0.85^t as 85% growth is the known slip.
Sidekick.game(Sidekick.play({
  title: "Growth or Decay Rate",
  emoji: "📉",
  premise: "In y = a·b^t, the base b tells the story. Above 1 it grows. Below 1 it decays. The distance from 1 is the percent rate.",
  outro: "Base 1.15 means 15% growth. Base 0.85 means 15% decay, since 85% is kept.",
  scene: "city",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Compare the base with 1. How far above or below is it?",
  tag: "reads_decay_as_growth",
  rounds: [
    { say: "What does each function do?", rows: [["y = 500(0.85)^t", "decays 15% each period"], ["y = 500(1.15)^t", "grows 15% each period"]], extra: "grows 85% each period|", trap: [0, "grows 85% each period"], why: "0.85 is less than 1. Each period keeps 85% and loses 15%.", win: "Below 1 decays. Above 1 grows." },
    { say: "Growth or decay?", kind: "sort", fs: 6, bins: "Growth|Decay", items: ["(1.03)^t|2^t|(1.5)^t", "(0.97)^t|(0.5)^t"], trap: ["(0.97)^t", 0], why: "0.97 is below 1, so the amount shrinks by 3% each time.", win: "Compare the base with 1." },
    { say: "Match these by yourself.", rows: [["y = 80(0.9)^t", "decays 10% each period"], ["y = 80(1.02)^t", "grows 2% each period"], ["y = 80(0.5)^t", "halves each period"]], extra: "grows 90% each period|", trap: [0, "grows 90% each period"] },
  ],
}));
