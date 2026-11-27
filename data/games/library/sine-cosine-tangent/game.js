// Sine, Cosine, Tangent. Skill G-SRT.C.6-2.
// Defining trigonometric ratios for acute angles. Swapping opposite and adjacent is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sine, Cosine, Tangent",
  emoji: "📏",
  premise: "From an acute angle, a right triangle has an opposite side, an adjacent side and the hypotenuse. Three ratios name their relationships.",
  outro: "sin = opposite ÷ hypotenuse. cos = adjacent ÷ hypotenuse. tan = opposite ÷ adjacent.",
  scene: "paper",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Opposite is across from the angle. Adjacent touches the angle.",
  tag: "swaps_opposite_adjacent",
  rounds: [
    { say: "Find the three ratios for angle θ.", fig: { type: "poly", pts: [[12, 86], [88, 86], [88, 26]], sides: ["4", "3", "5"], angles: ["θ", null, null], right: 1, v: [] }, rows: [["sin θ", "{3/5}"], ["cos θ", "{4/5}"], ["tan θ", "{3/4}"]], extra: "{4/3}", trap: [0, "{4/5}"], why: "The 4 touches the angle, so it is adjacent. Sine uses the opposite side, 3.", win: "Opposite 3, adjacent 4, hypotenuse 5." },
    { say: "Find the three ratios for angle θ.", fig: { type: "poly", pts: [[12, 86], [88, 86], [88, 26]], sides: ["12", "5", "13"], angles: ["θ", null, null], right: 1, v: [] }, rows: [["sin θ", "{5/13}"], ["cos θ", "{12/13}"], ["tan θ", "{5/12}"]], extra: "{12/5}", trap: [2, "{12/5}"], why: "Tangent is opposite over adjacent: 5 over 12.", win: "Opposite 5, adjacent 12, hypotenuse 13." },
    { say: "Find the ratios by yourself.", fig: { type: "poly", pts: [[12, 86], [88, 86], [88, 26]], sides: ["15", "8", "17"], angles: ["θ", null, null], right: 1, v: [] }, rows: [["sin θ", "{8/17}"], ["cos θ", "{15/17}"], ["tan θ", "{8/15}"]], extra: "{15/8} {17/8}", trap: [0, "{15/17}"] },
  ],
}));
