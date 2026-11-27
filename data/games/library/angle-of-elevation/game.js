// Angle of Elevation. Skill G-SRT.C.8-3.
// Using trigonometric ratios and the Pythagorean theorem to solve applied problems. Placing the angle in another corner is the known slip.
Sidekick.game(Sidekick.play({
  title: "Angle of Elevation",
  emoji: "🔭",
  premise: "Looking up at the top of something makes a right triangle: the ground, the height, and your line of sight.",
  outro: "The angle of elevation sits at your eye, between the ground and the line of sight.",
  scene: "field",
  kind: "type",
  icon: "🔭",
  hint: "The angle is at the viewer, on the ground. Which side is across from it?",
  tag: "angle_in_other_corner",
  rounds: [
    { say: "You stand 50 feet from a tree and look up at 45° to its tip. Label the triangle.", kind: "fill", fs: 5, cast: "", rows: [["the 50 feet along the ground", "adjacent to the angle"], ["the height of the tree", "opposite the angle"], ["the ratio that links them", "tangent"]], extra: "the hypotenuse|", trap: [0, "the hypotenuse"], why: "The hypotenuse is the line of sight. The ground touches the angle, so it is adjacent.", win: "Adjacent, opposite, tangent." },
    { say: "Key in the height of the tree.", q: "50 feet away · angle of elevation 45° · tan 45° = 1", ans: 50, trap: 25, why: "Height = distance × tan 45° = 50 × 1.", win: "50 × 1 = 50 feet." },
    { say: "Find the height by yourself.", alt: [{ q: "You are 30 m from a tower. The angle of elevation is 45°. tan 45° = 1", ans: 30, trap: 15 }, { q: "A 20-foot ramp rises at 30° to the ground. sin 30° = 0.5. How high is its upper end?", ans: 10, trap: 40 }, { q: "A 40 m kite string makes 30° with the ground. sin 30° = 0.5. How high is the kite?", ans: 20, trap: 80 }] },
  ],
}));
