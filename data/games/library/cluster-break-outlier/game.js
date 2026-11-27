// Cluster, Break, Outlier. Skill 6.SP.A.2-2.
// Recognizing clusters, empty stretches and outliers in a data set. Ignoring outliers is the known slip.
Sidekick.game(Sidekick.play({
  title: "Cluster, Break, Outlier",
  emoji: "🔭",
  premise: "Data often bunches into a cluster. An outlier sits far away from the rest, across an empty stretch.",
  outro: "A cluster is a bunch of close values. An outlier is a value far from the others.",
  scene: "space",
  kind: "pick",
  fs: 6.4,
  hint: "Look for a value with a big empty stretch between it and the rest.",
  tag: "ignores_outliers",
  rounds: [
    { say: "Tap the value that sits far away from the rest.", yes: "98", no: "70 72 74 75 78 80", trap: "80", why: "80 sits with the cluster. Look for the value with a big jump before it.", win: "98 is the outlier." },
    { say: "Name each feature of the dot plot.", kind: "fill", fs: 5.6, cast: "", fig: { type: "bars", stack: true, given: [["2", 2], ["3", 3], ["4", 2], ["5", 0], ["6", 0], ["7", 0], ["8", 0], ["9", 1]], cap: 4, v: [] }, rows: [["the values 2 to 4", "cluster"], ["nothing from 5 to 8", "empty stretch"], ["the value 9", "outlier"]], trap: [2, "cluster"], why: "One value far from the rest is an outlier, not a cluster.", win: "A cluster, an empty stretch, then an outlier." },
    { say: "Tap every outlier by yourself.", yes: "3 95", no: "48 50 51 53 55 56", trap: "-3" },
  ],
}));
