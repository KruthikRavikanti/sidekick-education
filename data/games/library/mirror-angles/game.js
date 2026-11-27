// Mirror Angles. Skill F-TF.A.3-2.
// Using the unit circle and symmetry to find values at related angles. Ignoring the reference angle or the sign is the known slip.
Sidekick.game(Sidekick.play({
  title: "Mirror Angles",
  emoji: "🪞",
  premise: "Every angle has a reference angle in the first quadrant. The trig value is the same size. The quadrant gives the sign.",
  outro: "Find the reference angle to the x-axis, use its value, then set the sign by quadrant.",
  scene: "night",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "How far is the angle from the nearest part of the x-axis: 180° or 360°?",
  tag: "ignores_reference_angle",
  rounds: [
    { say: "Find the reference angle: the distance to the x-axis.", rows: [["150°", "30°"], ["225°", "45°"], ["300°", "60°"]], extra: "75° 120°", trap: [0, "60°"], why: "Measure to the x-axis at 180°: 180 − 150 = 30.", win: "180 − 150, 225 − 180, 360 − 300." },
    { say: "Use the reference angle 30°, then the sign for the quadrant.", rows: [["sin 150°", "{1/2}"], ["cos 150°", "−{√3/2}"], ["sin 210°", "−{1/2}"]], extra: "{√3/2}", trap: [1, "{√3/2}"], why: "150° is left of the y-axis, so its cosine is negative.", win: "Same sizes as 30°, signs from the quadrant." },
    { say: "Find each value by yourself.", rows: [["sin 135°", "{√2/2}"], ["cos 135°", "−{√2/2}"], ["sin 330°", "−{1/2}"], ["cos 300°", "{1/2}"]], extra: "−{√3/2}", trap: [1, "{√2/2}"] },
  ],
}));
