// Label and Scale the Graph. Skill A-CED.A.2-2.
// Graphing equations on coordinate axes with labels and scales. Using unlabeled or uneven axes is the known slip.
Sidekick.game(Sidekick.play({
  title: "Label and Scale the Graph",
  emoji: "🏷️",
  premise: "A graph without labels and even scales cannot be read. Name both axes, give units, and count in equal steps.",
  outro: "Graph equations on axes with labels, units and evenly spaced scales.",
  scene: "paper",
  kind: "sort",
  fs: 4.8,
  hint: "Could a stranger tell what each axis measures and how much each step is worth?",
  tag: "unlabeled_or_uneven_axes",
  rounds: [
    { say: "Graph C = 2m + 3. Turn the dials until the line passes through both stars.", kind: "dial", cast: "", view: { type: "graph", fn: "line", pts: [[0, 3], [10, 23]], win: [0, 12, 0, 24], axis: ["miles", "cost ($)"] }, dials: [["Slope", 0, 4, 1, 0], ["Start", 0, 6, 1, 0]], ans: [2, 3], trap: [3, 2], why: "The line starts at 3 dollars and climbs 2 for every mile.", win: "From (0, 3) up to (10, 23)." },
    { say: "Good axes, or poor axes?", bins: "Good axes|Poor axes", items: ["labeled “miles” and “cost in dollars”|equal steps of 2 along each axis", "no labels at all|steps of 1, 5, 6, then 20"], trap: ["steps of 1, 5, 6, then 20", 0], why: "Uneven steps bend the picture. A straight line would look crooked.", win: "Labels, units and even steps." },
    { say: "Sort these by yourself.", bins: "Good axes|Poor axes", items: ["x-axis “hours”, y-axis “pay ($)”|every grid line worth 5", "both axes just say “numbers”|the scale jumps 0, 1, 10, 11"], trap: ["both axes just say “numbers”", 0] },
  ],
}));
