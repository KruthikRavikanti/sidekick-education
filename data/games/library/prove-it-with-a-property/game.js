// Prove It With a Property. Skill 5.G.B.3-2.
// Explaining category membership with properties: a square is a rectangle because it has four right angles. Reasoning from how shapes look is the known slip.
Sidekick.game(Sidekick.play({
  title: "Prove It With a Property",
  emoji: "⚖️",
  premise: "Shapes are sorted by their properties, not by how they look. Give the real reason each time.",
  outro: "A shape belongs to a family because it has the properties that family requires.",
  scene: "paper",
  kind: "fill",
  cast: "",
  hint: "Name a property you could measure, like sides or angles.",
  tag: "judges_by_look",
  rounds: [
    { say: "Pick the real reason.", rows: [["A square is a rectangle because it has", "4 right angles"], ["A rectangle is not always a square. It may not have", "4 equal sides"]], extra: "a boxy look|3 sides", trap: [0, "a boxy look"], why: "How a shape looks is not a reason. Rectangles are defined by their right angles.", win: "Right angles and equal sides." },
    { say: "Pick the real reason.", rows: [["A square is a rhombus because it has", "4 equal sides"], ["A rhombus is not always a square. It may not have", "4 right angles"]], extra: "a tilted look|5 sides", trap: [1, "a tilted look"], why: "Tilting does not change a shape. A rhombus may be missing right angles.", win: "Equal sides and right angles." },
    { say: "Pick the real reasons by yourself.", rows: [["A rectangle is a parallelogram because it has", "parallel opposite sides"], ["A parallelogram is not always a rectangle. It may not have", "4 right angles"]], extra: "a wide shape|4 equal sides", trap: [0, "a wide shape"] },
  ],
}));
