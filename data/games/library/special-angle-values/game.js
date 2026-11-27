// Special Angle Values. Skill F-TF.A.3-1.
// Using special triangles to find sine, cosine and tangent at π/6, π/4 and π/3. Swapping the sine and cosine values is the known slip.
Sidekick.game(Sidekick.play({
  title: "Special Angle Values",
  emoji: "📐",
  premise: "Two special triangles give exact trig values. In the 30-60-90 triangle, the short leg is half the hypotenuse.",
  outro: "sin {π/6} = {1/2}, cos {π/6} = {√3/2}, sin {π/4} = cos {π/4} = {√2/2}, tan {π/4} = 1.",
  scene: "night",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Sine is the height. At a small angle like 30° the height is small: one half.",
  tag: "swaps_sine_cosine",
  rounds: [
    { say: "π/6 is 30°. Match each value.", rows: [["sin {π/6}", "{1/2}"], ["cos {π/6}", "{√3/2}"], ["tan {π/4}", "1"]], extra: "{√2/2}", trap: [0, "{√3/2}"], why: "At 30° the point is far across and only a little way up. The height is one half.", win: "Small angle, small sine." },
    { say: "π/3 is 60° and π/4 is 45°. Match each value.", rows: [["sin {π/3}", "{√3/2}"], ["cos {π/3}", "{1/2}"], ["sin {π/4}", "{√2/2}"]], extra: "1", trap: [1, "{√3/2}"], why: "At 60° the point is high but not far across. The cosine is one half.", win: "60° swaps the values of 30°." },
    { say: "Match these by yourself.", alt: [{ rows: [["sin 30°", "{1/2}"], ["cos 30°", "{√3/2}"], ["cos 45°", "{√2/2}"], ["tan 45°", "1"]], extra: "√3", trap: [0, "{√3/2}"] }, { rows: [["cos 60°", "{1/2}"], ["sin 60°", "{√3/2}"], ["sin 45°", "{√2/2}"], ["tan 45°", "1"]], extra: "√3", trap: [0, "{√3/2}"] }] },
  ],
}));
