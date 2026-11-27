// Shape Family Tree. Skill 5.G.B.4-2.
// Ordering categories in a hierarchy from most general to most specific. Reversing the general and the specific categories is the known slip.
Sidekick.game(Sidekick.play({
  title: "Shape Family Tree",
  emoji: "🌳",
  premise: "The biggest family is at the top of the tree. Each branch below it is a smaller, more special group.",
  outro: "Go from general to specific: every shape below also belongs to the groups above it.",
  scene: "forest",
  kind: "row",
  hint: "Which group contains all the others? Start with that one.",
  tag: "reverses_the_hierarchy",
  rounds: [
    { say: "Put the families in order from most general to most specific.", seq: "quadrilateral|parallelogram|rectangle|square", trap: "reverse", why: "Every square is a rectangle, but not the other way round. The biggest group goes first.", win: "Each one is a special kind of the one before it." },
    { say: "Order these from most general to most specific.", seq: "polygon|quadrilateral|parallelogram|rhombus", trap: "reverse", why: "Polygon is the biggest group. It holds all the others.", win: "From the biggest family to the most special." },
    { say: "Order these by yourself.", alt: [{ seq: "polygon|triangle|isosceles triangle|equilateral triangle", trap: "reverse" }, { seq: "shape|polygon|quadrilateral|rectangle|square", trap: "reverse" }] },
  ],
}));
