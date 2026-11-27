// What Defines Each Motion. Skill G-CO.A.4-1.
// Developing definitions of rotations, reflections and translations in terms of angles, circles, perpendicular lines and parallel lines. Describing motions loosely is the known slip.
Sidekick.game(Sidekick.play({
  title: "What Defines Each Motion",
  emoji: "🧭",
  premise: "Each rigid motion is fixed by a small set of facts. Give those and anyone can perform it exactly.",
  outro: "Rotation: center, angle, direction. Reflection: a line. Translation: a distance and direction.",
  scene: "paper",
  kind: "fill",
  fs: 5,
  cast: "",
  hint: "What would you have to tell someone so they could do exactly the same move?",
  tag: "loose_description",
  rounds: [
    { say: "What do you need to know to define each motion?", rows: [["rotation", "a center, an angle and a direction"], ["reflection", "a line of reflection"], ["translation", "a distance and a direction"]], extra: "a scale factor|", trap: [0, "a line of reflection"], why: "A rotation turns about a point. It needs a center and how far to turn.", win: "Three motions, three kinds of information." },
    { say: "Complete each fact.", rows: [["rotation: a point and its image are", "equally far from the center"], ["reflection: the mirror line is", "halfway between point and image"], ["translation: every point moves", "the same distance and direction"]], trap: [0, "the same distance and direction"], why: "In a rotation, points travel on circles around the center.", win: "Circles, perpendicular bisectors, parallel paths." },
    { say: "Name each motion by yourself.", rows: [["every point moves along parallel paths", "translation"], ["every point turns about one fixed point", "rotation"], ["every point flips across a line", "reflection"]], extra: "dilation", trap: [0, "dilation"] },
  ],
}));
