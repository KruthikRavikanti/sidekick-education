// Two Centers of a Triangle. Skill G-C.A.3-1.
// Constructing the inscribed and circumscribed circles of a triangle. Confusing the incenter and the circumcenter is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Centers of a Triangle",
  emoji: "🔺",
  premise: "A triangle has a circle through its corners and a circle touching its sides. Their centers are found in different ways.",
  outro: "Circumcenter: where perpendicular bisectors meet. Incenter: where angle bisectors meet.",
  scene: "paper",
  kind: "fill",
  fs: 4.8,
  cast: "",
  hint: "Corners need equal distance to points: bisect the sides. Sides need equal distance to lines: bisect the angles.",
  tag: "confuses_centers",
  rounds: [
    { say: "Where is the center of each circle?", rows: [["the circle through all three corners", "where the perpendicular bisectors meet"], ["the circle touching all three sides", "where the angle bisectors meet"]], extra: "where the medians meet|", trap: [0, "where the angle bisectors meet"], why: "To be equally far from the corners, the center must be on the perpendicular bisector of each side.", win: "Side bisectors for corners. Angle bisectors for sides." },
    { say: "What is special about each center?", rows: [["circumcenter", "equally far from the three corners"], ["incenter", "equally far from the three sides"]], extra: "the middle of the longest side|", trap: [1, "equally far from the three corners"], why: "The incenter is the center of the circle that touches the sides.", win: "Corners or sides." },
    { say: "Match these by yourself.", rows: [["to draw the circumscribed circle, find the", "circumcenter"], ["to draw the inscribed circle, find the", "incenter"]], extra: "centroid|midpoint", trap: [0, "incenter"] },
  ],
}));
