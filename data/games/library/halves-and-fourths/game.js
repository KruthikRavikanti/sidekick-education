// Halves and Fourths. Skill 1.G.A.3-2.
// The words halves, fourths and quarters: the shares must be equal. Two unequal pieces called halves is the known slip.
Sidekick.game(Sidekick.play({
  title: "Halves and Fourths",
  emoji: "🍰",
  premise: "The bakery cuts its cakes into halves and fourths. Sort each cake by how it is cut.",
  outro: "Two equal shares are halves. Four equal shares are fourths, or quarters.",
  scene: "candy",
  kind: "sort",
  cast: "",
  figW: 12,
  hint: "Count the shares, then check that they are the same size.",
  tag: "any_two_pieces_are_halves",
  rounds: [
    { say: "Sort each cake by how it is cut.", bins: "Halves|Fourths|Not equal", items: ["~pie:0/2 ~bar:0/2", "~pie:0/4 ~sq4:0/4", "~pieU:2 ~barU:4"], trap: ["~pieU:2", 0], why: "Halves are 2 equal shares. These two are not equal.", win: "Halves, fourths and unequal pieces." },
    { say: "One share is shaded. Drag its name under each cake.", kind: "fill", rows: [["~pie:1/2", "half"], ["~pie:1/4", "fourth"], ["~bar:1/4", "quarter"]], extra: "whole", trap: [1, "half"], why: "This cake has 4 equal shares. One of them is a fourth.", win: "A half, a fourth and a quarter." },
    { say: "Sort these cakes by yourself.", bins: "Halves|Fourths|Not equal", items: ["~bar:0/2 ~pie:0/2", "~bar:0/4 ~pie:0/4 ~sq4:0/4", "~barU:2 ~pieU:4"], trap: ["~barU:2", 0] },
  ],
}));
