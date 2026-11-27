// Two Angles Are Enough. Skill 8.G.A.5-3.
// Using the angle-angle criterion for similarity of triangles. Deciding from one matching angle only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Angles Are Enough",
  emoji: "👯",
  premise: "If two angles of one triangle match two angles of another, the third angles match as well. The triangles are similar.",
  outro: "AA: two pairs of equal angles make two triangles similar.",
  scene: "paper",
  kind: "sort",
  fs: 5.2,
  hint: "Find the third angle of each triangle. Do all three match?",
  tag: "uses_one_angle",
  rounds: [
    { say: "Two angles of each triangle are given. Are the triangles similar?", bins: "Similar|Not similar", items: ["40°, 60° and 40°, 80°|50°, 50° and 50°, 80°", "40°, 60° and 40°, 70°|30°, 90° and 30°, 80°"], trap: ["40°, 60° and 40°, 70°", 0], why: "One matching angle is not enough. The third angles are 80° and 70°.", win: "All three angles must match." },
    { say: "Sort these.", bins: "Similar|Not similar", items: ["90°, 30° and 60°, 30°|20°, 100° and 60°, 20°", "90°, 30° and 90°, 40°|45°, 45° and 45°, 60°"], trap: ["90°, 30° and 90°, 40°", 0], why: "The third angles are 60° and 50°. Only one angle matches.", win: "Find the third angle first." },
    { say: "Sort these by yourself.", bins: "Similar|Not similar", items: ["35°, 65° and 80°, 35°|70°, 70° and 40°, 70°", "35°, 65° and 35°, 75°|60°, 60° and 60°, 50°"], trap: ["35°, 65° and 35°, 75°", 0] },
  ],
}));
