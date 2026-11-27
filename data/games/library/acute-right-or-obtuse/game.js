// Acute, Right or Obtuse. Skill 4.G.A.1-2.
// Classifying angles as acute, right or obtuse by comparing with 90 degrees. Judging by how wide it looks without checking against 90 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Acute, Right or Obtuse",
  emoji: "🦈",
  premise: "A right angle is a square corner, exactly 90 degrees. Acute angles are smaller and obtuse angles are bigger.",
  outro: "Less than 90 is acute. Exactly 90 is right. More than 90 is obtuse.",
  scene: "ocean",
  kind: "sort",
  hint: "Compare with a square corner: is it smaller, the same, or bigger than 90 degrees?",
  tag: "judges_by_look",
  rounds: [
    { say: "Sort the angles.", bins: "Acute|Right|Obtuse", items: ["~ang:40 ~ang:20:s", "~ang:90", "~ang:130 ~ang:160:s"], trap: ["~ang:130", 0], why: "This one opens wider than a square corner. It is obtuse.", win: "Smaller, equal and bigger than a square corner." },
    { say: "Now sort by the numbers. Some are very close to 90.", bins: "Acute|Right|Obtuse", items: ["89° 45° 12°", "90°", "91° 120° 175°"], trap: ["91°", 1], why: "91 is just past 90, so it is obtuse. Only exactly 90 is a right angle.", win: "Only 90 is right." },
    { say: "Sort these by yourself.", bins: "Acute|Right|Obtuse", items: ["~ang:35 88° 7°", "90° ~ang:90:s", "~ang:150 92° 101°"], trap: ["92°", 1] },
  ],
}));
