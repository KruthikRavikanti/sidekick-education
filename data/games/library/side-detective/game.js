// Side Detective. Skill 4.G.A.2-1.
// Classifying two-dimensional figures by parallel or perpendicular sides. Missing parallel sides that are not horizontal is the known slip.
Sidekick.game(Sidekick.play({
  title: "Side Detective",
  emoji: "🕵️",
  premise: "Look closely at the sides of each shape. Parallel sides can hide when the shape is turned.",
  outro: "A shape keeps its parallel and perpendicular sides no matter how it is turned.",
  scene: "city",
  kind: "sort",
  figW: 17,
  hint: "Turn your head. Do any two sides run the same way and never meet?",
  tag: "misses_tilted_parallels",
  rounds: [
    { say: "Does the shape have any parallel sides?", bins: "Has parallel sides|No parallel sides", items: ["~quad:rect ~quad:para ~quad:trap", "~tri:e ~quad:kite ~quad:odd"], trap: ["~quad:trap", 1], why: "Its bottom and its roof run the same way. That is one pair of parallel sides.", win: "You found the parallel sides." },
    { say: "Some of these are turned.", bins: "Has parallel sides|No parallel sides", items: ["~quad:rhomb ~poly:15,70;45,20;86,30;50,90 ~quad:sq", "~tri:s ~quad:kite ~tri:o"], trap: ["~poly:15,70;45,20;86,30;50,90", 1], why: "It is a trapezoid that has been turned. Two of its sides still run the same way.", win: "Turning a shape does not change its sides." },
    { say: "Does the shape have perpendicular sides, the kind that meet at a square corner?", bins: "Has square corners|No square corners", items: ["~quad:sq ~tri:r ~poly:50,20;20,50;80,50", "~quad:rhomb ~tri:e ~quad:para"], trap: ["~poly:50,20;20,50;80,50", 1], why: "Look at its roof. The two short sides meet at a square corner.", win: "Square corners can point any way." },
    { say: "Sort these by yourself. Does the shape have any parallel sides?", bins: "Has parallel sides|No parallel sides", items: ["~quad:para ~poly:15,70;45,20;86,30;50,90 ~quad:tall ~quad:rhomb", "~tri:i ~quad:odd ~quad:kite"], trap: ["~poly:15,70;45,20;86,30;50,90", 1] },
  ],
}));
