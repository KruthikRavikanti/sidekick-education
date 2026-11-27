// Curves That Hug a Line. Skill F-IF.C.7-5.
// Graphing exponential and logarithmic functions, showing intercepts and end behavior. Drawing an exponential across its asymptote is the known slip.
Sidekick.game(Sidekick.play({
  title: "Curves That Hug a Line",
  emoji: "🌙",
  premise: "An exponential graph flattens toward the x-axis without touching it. A logarithm graph does the same with the y-axis.",
  outro: "y = 2^x: intercept (0, 1), asymptote y = 0. y = log x: intercept (1, 0), asymptote x = 0.",
  scene: "night",
  kind: "fill",
  fs: 5.6,
  figW: 17,
  cast: "",
  hint: "Anything to the power 0 is 1. Can 2^x ever reach 0?",
  tag: "crosses_asymptote",
  rounds: [
    { say: "For f(x) = 2^x, find the features.", rows: [["y-intercept", "(0, 1)"], ["asymptote", "y = 0"]], extra: "(1, 0)|x = 0", trap: [0, "(1, 0)"], why: "2^0 is 1, so the graph crosses the y-axis at height 1.", win: "Through (0, 1), hugging y = 0." },
    { say: "Match each function to its graph.", rows: [["y = 2^x", "~plot:exp:1:2:0"], ["y = (0.5)^x", "~plot:exp:1:0.5:0"], ["y = log x, base 2", "~plot:log:2:0:0"]], trap: [1, "~plot:exp:1:2:0"], why: "A base below 1 shrinks as x grows. That graph falls from left to right.", win: "Growth, decay and a logarithm." },
    { say: "For g(x) = log x with base 2, match by yourself.", rows: [["x-intercept", "(1, 0)"], ["asymptote", "x = 0"]], extra: "(0, 1)|y = 0", trap: [0, "(0, 1)"] },
  ],
}));
