// How Good Is the Fit?. Skill 8.SP.A.2-2.
// Informally assessing the fit of a line by judging the closeness of the data points. Forcing the line through the origin is the known slip.
Sidekick.game(Sidekick.play({
  title: "How Good Is the Fit?",
  emoji: "🎯",
  premise: "A line fits well when the dots hug it. Forcing the line through the origin, or leaving dots far away, makes a poor fit.",
  outro: "Judge a fit by how close the dots are to the line. It does not need to pass through (0, 0).",
  scene: "paper",
  kind: "sort",
  fs: 4.8,
  hint: "Are the dots close to the line, on both sides?",
  tag: "forces_through_origin",
  rounds: [
    { say: "The line starts at the origin and misses the dots. Fix it.", kind: "dial", cast: "", view: { type: "graph", fn: "line", dots: [[0, 3], [2, 4], [4, 5], [6, 6]], win: [0, 8, 0, 8] }, dials: [["Slope", 0, 3, 0.5, 1.5], ["Height", 0, 5, 1, 0]], ans: [0.5, 3], trap: [1, 0], why: "A line of fit does not have to pass through (0, 0). These dots start at height 3.", win: "Now every dot sits on the line." },
    { say: "Good fit or poor fit?", bins: "Good fit|Poor fit", items: ["dots close to the line on both sides|line follows the trend of the dots", "most dots far above the line|forced through (0, 0) though the dots start high"], trap: ["forced through (0, 0) though the dots start high", 0], why: "The dots decide where the line goes, not the origin.", win: "Close and balanced is a good fit." },
    { say: "Sort these by yourself.", bins: "Good fit|Poor fit", items: ["dots hug the line|about half the dots on each side", "every dot is below the line|line slopes down while the dots rise"], trap: ["every dot is below the line", 0] },
  ],
}));
