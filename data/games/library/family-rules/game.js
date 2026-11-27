// Family Rules. Skill 5.G.B.3-1.
// Attributes of a category of figures belong to all its subcategories: squares are rectangles, so squares have four right angles. Thinking a square is not a rectangle is the known slip.
Sidekick.game(Sidekick.play({
  title: "Family Rules",
  emoji: "👪",
  premise: "Shapes belong to families. Whatever is true for the whole family is true for every member of it.",
  outro: "A square is a special rectangle, so everything true of all rectangles is true of squares.",
  scene: "paper",
  kind: "sort",
  hint: "A square has everything a rectangle needs: 4 sides and 4 right angles.",
  tag: "square_is_not_a_rectangle",
  rounds: [
    { say: "Sort each statement.", bins: "Always true|Not always true", items: ["A square is a rectangle|A square has 4 right angles", "A rectangle is a square|A parallelogram has 4 right angles"], trap: ["A square is a rectangle", 1], why: "A rectangle needs 4 right angles. Every square has them.", win: "Squares belong to the rectangle family." },
    { say: "Sort these.", bins: "Always true|Not always true", items: ["A square is a rhombus|A rhombus has 4 equal sides", "A rhombus is a square|A rectangle has 4 equal sides"], trap: ["A square is a rhombus", 1], why: "A rhombus needs 4 equal sides. Every square has them.", win: "Squares belong to the rhombus family too." },
    { say: "Sort these by yourself.", bins: "Always true|Not always true", items: ["A rectangle is a parallelogram|A square has 2 pairs of parallel sides", "A parallelogram is a rectangle|A quadrilateral is a square|A rhombus has 4 right angles"], trap: ["A rectangle is a parallelogram", 1] },
  ],
}));
