// AA Makes Them Similar. Skill G-SRT.A.3-1.
// Using the properties of similarity transformations to establish the AA criterion. Thinking one matching angle is enough is the known slip.
Sidekick.game(Sidekick.play({
  title: "AA Makes Them Similar",
  emoji: "📐",
  premise: "Two pairs of equal angles force the third pair to match, and that is enough for similarity.",
  outro: "AA criterion: two triangles with two pairs of congruent angles are similar.",
  scene: "paper",
  kind: "sort",
  fs: 5.2,
  hint: "Find the third angle of each triangle. Then compare all three.",
  tag: "one_angle_enough",
  rounds: [
    { say: "Two angles of each triangle are given. Similar or not?", bins: "Similar|Not similar", items: ["50°, 60° and 50°, 70°|90°, 40° and 50°, 40°", "50°, 60° and 50°, 65°|30°, 100° and 30°, 60°"], trap: ["50°, 60° and 50°, 65°", 0], why: "The third angles are 70° and 65°. Only the 50° matches.", win: "Two matching angles are needed." },
    { say: "Triangle 1 has angles 50° and 60°. Key in its third angle.", kind: "type", icon: "📐", unit: "°", ans: 70, trap: 110, why: "110 is what the two given angles add up to. Subtract from 180.", win: "180 − 110 = 70°. Triangle 2 has 50°, 70° and 60° too." },
    { say: "Sort these by yourself.", bins: "Similar|Not similar", items: ["45°, 45° and 90°, 45°|20°, 70° and 90°, 20°", "45°, 45° and 45°, 50°|25°, 80° and 25°, 70°"], trap: ["45°, 45° and 45°, 50°", 0] },
  ],
}));
