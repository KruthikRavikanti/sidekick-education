// Other Four-Siders. Skill 3.G.A.1-2.
// Quadrilaterals that are not rectangles, squares or rhombuses: trapezoids, kites and other four-sided figures are still quadrilaterals.
Sidekick.game(Sidekick.play({
  title: "Other Four-Siders",
  emoji: "🔶",
  premise: "Not every shape with four sides is a square or a rectangle. Meet the other quadrilaterals.",
  outro: "A quadrilateral is any closed shape with four straight sides.",
  scene: "paper",
  kind: "sort",
  cast: "",
  hint: "Does it have four square corners? If not, it is not a rectangle.",
  tag: "every_four_sider_is_a_rectangle",
  rounds: [
    { say: "Sort the four-sided shapes.", bins: "Rectangle or square|Other quadrilateral", items: ["~quad:sq ~quad:rect ~quad:tall", "~quad:trap ~quad:kite ~quad:para"], trap: ["~quad:para", 0], why: "Its corners are not square corners. It is a different quadrilateral.", win: "Four sides, but not all are rectangles." },
    { say: "Tap every quadrilateral that is NOT a rectangle, square or rhombus.", kind: "pick", yes: "~quad:trap ~quad:kite ~quad:odd ~quad:para", no: "~quad:sq ~quad:rect ~quad:rhomb", trap: "~quad:rhomb", why: "All four sides are equal. That one is a rhombus.", win: "Four other quadrilaterals." },
    { say: "Tap every quadrilateral that is NOT a rectangle, square or rhombus.", kind: "pick", yes: "~quad:odd ~quad:trap ~quad:kite", no: "~quad:sq ~quad:tall ~quad:rhomb ~tri:e", trap: "~quad:rhomb" },
  ],
}));
