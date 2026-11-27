// Congruent by Motion. Skill G-CO.B.6-2.
// Using the definition of congruence in terms of rigid motions to decide if two figures are congruent. Judging by appearance is the known slip.
Sidekick.game(Sidekick.play({
  title: "Congruent by Motion",
  emoji: "🧩",
  premise: "Two figures are congruent if some rigid motion carries one exactly onto the other. A mirror image still counts.",
  outro: "Congruent means a sequence of rigid motions maps one figure onto the other.",
  scene: "paper",
  kind: "sort",
  fs: 4.6,
  hint: "Could a slide, turn or flip put one exactly on the other?",
  tag: "judges_by_appearance",
  rounds: [
    { say: "Are the two figures congruent?", bins: "Congruent|Not congruent", items: ["same sides, one is a mirror image|same sides, one is upside down|one slides onto the other", "same angles, one twice as big|sides 3-4-5 and sides 6-8-10"], trap: ["same sides, one is a mirror image", 1], why: "A reflection is a rigid motion. A mirror image is congruent.", win: "Flips, turns and slides all count." },
    { say: "A maps onto B. Finish each statement.", kind: "fill", fs: 5.4, cast: "", fig: { type: "graph", fn: "none", shapes: [{ pts: [[1, 1], [4, 1], [1, 3]], name: "A" }, { pts: [[-1, 1], [-4, 1], [-1, 3]], name: "B" }], win: [-5, 5, -5, 5], h: 46, v: [] }, rows: [["A maps onto B by", "a reflection"], ["so A and B are", "congruent"]], extra: "a dilation|not congruent", trap: [1, "not congruent"], why: "A reflection keeps every length and angle. The triangles match exactly.", win: "A rigid motion proves congruence." },
    { say: "Sort these by yourself.", bins: "Congruent|Not congruent", items: ["twin triangles facing opposite ways|a square, turned 45°|a shape and its slide", "a photo and its enlargement|2 by 3 and 2 by 4 rectangles"], trap: ["twin triangles facing opposite ways", 1] },
  ],
}));
