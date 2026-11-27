// Find Every Angle. Skill F-TF.B.7-1.
// Using inverse functions to solve trigonometric equations and interpreting the solutions. Giving one solution in the period is the known slip.
Sidekick.game(Sidekick.play({
  title: "Find Every Angle",
  emoji: "🎯",
  premise: "A trig equation usually has more than one solution in a full turn. The calculator gives one. Symmetry gives the other.",
  outro: "In one full turn, sin x = k and cos x = k usually have two solutions each.",
  scene: "night",
  kind: "pick",
  hint: "Sine is the height. Which two angles have that height? Cosine is across: which two angles?",
  tag: "one_solution_only",
  rounds: [
    { say: "Solve sin x = {1/2} between 0° and 360°. Tap every solution.", yes: "30° 150°", no: "60° 210° 330° 120°", trap: "-150°", why: "The height is also one half at 150°, the mirror image across the y-axis.", win: "30° and 150°." },
    { say: "Solve cos x = {1/2} between 0° and 360°. Tap every solution.", yes: "60° 300°", no: "30° 120° 240° 150°", trap: "-300°", why: "The across distance is also one half at 300°, below the x-axis.", win: "60° and 300°." },
    { say: "Tap every solution by yourself.", alt: [{ say: "By yourself: solve cos x = 0 between 0° and 360°. Tap every solution.", yes: "90° 270°", no: "0° 180° 360° 45°", trap: "-270°" }, { say: "By yourself: solve tan x = 1 between 0° and 360°. Tap every solution.", yes: "45° 225°", no: "135° 315° 90° 180°", trap: "-225°" }, { say: "By yourself: solve sin x = −{1/2} between 0° and 360°. Tap every solution.", yes: "210° 330°", no: "30° 150° 240° 300°", trap: "-330°" }] },
  ],
}));
