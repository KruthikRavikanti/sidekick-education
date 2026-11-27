// Scatter Plot Maker. Skill 8.SP.A.1-1.
// Constructing scatter plots for bivariate data. Connecting the points like a line graph is the known slip.
Sidekick.game(Sidekick.play({
  title: "Scatter Plot Maker",
  emoji: "🔵",
  premise: "A scatter plot shows two measurements for each person as one dot. The dots stay separate. Together they show a pattern.",
  outro: "Each point is one pair of values. Do not join the dots.",
  scene: "paper",
  kind: "plot",
  cast: "",
  axes: [0, 8, 0, 8],
  quiet: true,
  hint: "First number across, second number up. One dot for each pair.",
  tag: "connects_the_points",
  rounds: [
    { say: "Across is hours studied, up is quiz score. Plot the four students.", q: "(1, 3) · (2, 4) · (3, 6) · (4, 7)", ans: [[1, 3], [2, 4], [3, 6], [4, 7]], trap: [[3, 1], [4, 2], [6, 3], [7, 4]], why: "Hours go across. The first student is 1 across and 3 up.", win: "The dots rise from left to right." },
    { say: "True or not true about a scatter plot?", kind: "sort", fs: 4.8, bins: "True|Not true", items: ["Each dot is one student|The cloud of dots shows a trend", "Join the dots in order like a line graph|Each dot is an average"], trap: ["Join the dots in order like a line graph", 0], why: "The dots are separate people. Lines between them mean nothing.", win: "Dots stay separate." },
    { say: "Plot the pairs by yourself.", alt: [{ q: "(1, 7) · (2, 6) · (3, 4) · (4, 3)", ans: [[1, 7], [2, 6], [3, 4], [4, 3]], trap: [[7, 1], [6, 2], [4, 3], [3, 4]] }, { q: "(2, 2) · (3, 5) · (5, 6) · (6, 8)", ans: [[2, 2], [3, 5], [5, 6], [6, 8]], trap: [[2, 2], [5, 3], [6, 5], [8, 6]] }] },
  ],
}));
