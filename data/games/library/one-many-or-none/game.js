// One, Many or None. Skill 7.G.A.2-2.
// Noticing when conditions determine a unique triangle, more than one triangle, or no triangle. Thinking any three measures make exactly one triangle is the known slip.
Sidekick.game(Sidekick.play({
  title: "One, Many or None",
  emoji: "🔺",
  premise: "Three sides pin down exactly one triangle. Three angles pin down the shape but not the size. Some conditions cannot be met at all.",
  outro: "Three sides give one triangle. Three angles give many sizes. Impossible conditions give none.",
  scene: "paper",
  kind: "sort",
  fs: 5.2,
  hint: "Do the sides close up? Do the angles add to 180°? Could it be drawn bigger?",
  tag: "any_three_make_one",
  rounds: [
    { say: "How many different triangles fit each description?", bins: "Exactly one|Many|None", items: ["sides 5, 6, 7|", "angles 50°, 60°, 70°|", "sides 2, 3, 8|"], trap: ["angles 50°, 60°, 70°", 0], why: "Angles fix the shape but not the size. It can be drawn small or large.", win: "One, many and none." },
    { say: "Sort these.", bins: "Exactly one|Many|None", items: ["sides 4, 4, 4|sides 6, 8, 10", "angles 90°, 45°, 45°|", "angles 100°, 50°, 50°|sides 1, 1, 5"], trap: ["angles 100°, 50°, 50°", 1], why: "Those angles add to 200°. A triangle has only 180°.", win: "Check that it can exist first." },
    { say: "Sort these by yourself.", bins: "Exactly one|Many|None", items: ["sides 7, 8, 9|", "angles 30°, 60°, 90°|angles 60°, 60°, 60°", "sides 2, 2, 9|angles 90°, 90°, 20°"], trap: ["angles 60°, 60°, 60°", 0] },
  ],
}));
