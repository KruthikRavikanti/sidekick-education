// Precise Definitions. Skill G-CO.A.1-1.
// Knowing precise definitions of angle, circle, perpendicular line, parallel line and line segment. Using informal descriptions is the known slip.
Sidekick.game(Sidekick.play({
  title: "Precise Definitions",
  emoji: "📖",
  premise: "Geometry builds on exact definitions. “A round shape” is a description. “All points a fixed distance from a center” is a definition.",
  outro: "Define figures precisely from point, line, distance and angle.",
  scene: "paper",
  kind: "fill",
  fs: 4.8,
  cast: "",
  hint: "Which wording would let someone build the figure with no picture?",
  tag: "informal_description",
  rounds: [
    { say: "Match each term to its precise definition.", rows: [["circle", "all points a fixed distance from a center"], ["line segment", "part of a line between two endpoints"], ["parallel lines", "lines in a plane that never meet"]], extra: "a round shape|", trap: [0, "a round shape"], why: "An oval is round too. The definition must pin a circle down exactly.", win: "Definitions leave no room for doubt." },
    { say: "Match each term.", rows: [["angle", "two rays with a common endpoint"], ["perpendicular lines", "lines that meet at right angles"], ["ray", "part of a line with one endpoint"]], extra: "a pointy corner|", trap: [0, "a pointy corner"], why: "That describes how it looks. An angle is two rays from one endpoint.", win: "Built from rays, lines and right angles." },
    { say: "Match these by yourself.", rows: [["circle", "all points a fixed distance from a center"], ["angle", "two rays with a common endpoint"]], extra: "a round shape|a line that bends", trap: [1, "a line that bends"] },
  ],
}));
