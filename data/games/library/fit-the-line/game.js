// Fit the Line. Skill 8.SP.A.2-1.
// Informally fitting a straight line to a scatter plot. Connecting the first and last points is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fit the Line",
  emoji: "📏",
  premise: "A line of fit runs through the middle of the cloud of dots, with about as many above as below. It does not have to touch any dot.",
  outro: "A good line of fit follows the trend and balances the dots on both sides.",
  scene: "paper",
  kind: "sort",
  fs: 4.8,
  hint: "Count the dots above the line and below it. Are they about even?",
  tag: "connects_first_and_last",
  rounds: [
    { say: "Turn the dials until the line runs through the middle of the dots.", kind: "dial", cast: "", view: { type: "graph", fn: "line", dots: [[1, 3], [2, 2], [3, 5], [4, 4], [5, 7], [6, 6]], win: [0, 8, 0, 8] }, dials: [["Slope", 0, 3, 0.5, 0], ["Height", 0, 5, 1, 4]], ans: [1, 1], trap: [1, 3], why: "Most dots are below that line. Slide it down until half are above and half below.", win: "Three dots above, three below." },
    { say: "Good line of fit, or not?", bins: "Good fit|Poor fit", items: ["About as many dots above as below|Follows the direction of the dots", "Joins only the first and last dots|Has every dot on one side"], trap: ["Joins only the first and last dots", 0], why: "Two dots do not speak for the whole cloud.", win: "Balance and direction." },
    { say: "Sort these by yourself.", bins: "Good fit|Poor fit", items: ["Runs through the middle of the cloud|Leaves dots balanced on both sides", "Zigzags through every dot|Is drawn flat while the dots rise"], trap: ["Zigzags through every dot", 0] },
  ],
}));
