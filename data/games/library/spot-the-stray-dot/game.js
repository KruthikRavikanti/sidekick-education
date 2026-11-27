// Spot the Stray Dot. Skill 8.SP.A.1-3.
// Describing patterns such as clustering and outliers in scatter plots. Ignoring outliers is the known slip.
Sidekick.game(Sidekick.play({
  title: "Spot the Stray Dot",
  emoji: "🛸",
  premise: "Most dots in a scatter plot follow a pattern. An outlier sits far away from the pattern.",
  outro: "A cluster is a bunch of dots close together. An outlier is far from the overall pattern.",
  scene: "space",
  kind: "pick",
  fs: 6,
  hint: "Which dot does not follow the direction of the others?",
  tag: "ignores_outliers",
  rounds: [
    { say: "The dots rise in a line, except one. Tap the outlier.", fig: { type: "graph", fn: "points", pre: [1, 2, 2, 3, 3, 4, 4, 5, 6, 1], win: [0, 8, 0, 8], h: 46, v: [] }, yes: "(6, 1)|", no: "(1, 2)|(2, 3)|(3, 4)|(4, 5)", trap: "(4, 5)", why: "(4, 5) follows the rising pattern. Look for the dot far from the line.", win: "(6, 1) sits far below the pattern." },
    { say: "Name each feature of a scatter plot.", kind: "fill", fs: 5.4, cast: "", rows: [["dots bunched close together", "cluster"], ["a dot far from the pattern", "outlier"], ["dots rising left to right", "positive trend"]], extra: "negative trend|", trap: [1, "cluster"], why: "One lonely dot far away is an outlier.", win: "Cluster, outlier, trend." },
    { say: "The dots fall in a line, except one. Tap the outlier by yourself.", fig: { type: "graph", fn: "points", pre: [1, 6, 2, 5, 3, 5, 4, 4, 5, 3, 6, 2, 7, 7], win: [0, 8, 0, 8], h: 46, v: [] }, yes: "(7, 7)|", no: "(1, 6)|(2, 5)|(3, 5)|(4, 4)|(5, 3)|(6, 2)", trap: "(1, 6)" },
  ],
}));
