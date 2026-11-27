// Distance and Direction. Skill N-CN.B.4-2.
// Converting between rectangular and polar forms of complex numbers. Using an angle from another quadrant is the known slip.
Sidekick.game(Sidekick.play({
  title: "Distance and Direction",
  emoji: "🧭",
  premise: "Polar form describes a complex number by how far it is from 0 and which way it points.",
  outro: "Polar form uses the modulus r and the angle θ, measured from the positive real axis. Check the quadrant.",
  scene: "space",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Picture the point first. Which quadrant is it in?",
  tag: "angle_in_other_quadrant",
  rounds: [
    { say: "Each number lies on an axis. Match it to its distance r and angle θ.", rows: [["2", "r = 2, θ = 0°"], ["2i", "r = 2, θ = 90°"], ["−2", "r = 2, θ = 180°"]], extra: "r = 2, θ = 270°|", trap: [1, "r = 2, θ = 270°"], why: "2i is straight up, a quarter turn from the positive real axis.", win: "Right, up, left: 0°, 90°, 180°." },
    { say: "These all have r = √2. Find each angle.", rows: [["1 + i", "θ = 45°"], ["−1 + i", "θ = 135°"], ["−1 − i", "θ = 225°"]], extra: "θ = 315°|", trap: [1, "θ = 315°"], why: "−1 + i is left and up, in Quadrant II. 315° points right and down.", win: "Each quadrant adds 90°." },
    { say: "Match each number by yourself.", rows: [["1 − i", "r = √2, θ = 315°"], ["−3", "r = 3, θ = 180°"], ["−3i", "r = 3, θ = 270°"]], extra: "r = √2, θ = 45°|r = 3, θ = 90°", trap: [0, "r = √2, θ = 45°"] },
  ],
}));
