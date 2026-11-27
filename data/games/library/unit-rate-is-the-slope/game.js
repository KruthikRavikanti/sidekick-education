// Unit Rate Is the Slope. Skill 8.EE.B.5-1.
// Graphing proportional relationships and interpreting the unit rate as the slope. Using a y-value instead of rise over run is the known slip.
Sidekick.game(Sidekick.play({
  title: "Unit Rate Is the Slope",
  emoji: "⛰️",
  premise: "On the graph of a proportional relationship, the steepness of the line is the unit rate. Slope is rise over run.",
  outro: "Slope = rise ÷ run. For a line through the origin, it equals the unit rate.",
  scene: "paper",
  kind: "type",
  icon: "⛰️",
  hint: "How far up for how far across? Divide rise by run.",
  tag: "uses_y_value_as_slope",
  rounds: [
    { say: "Turn the dials until the line passes through both stars.", kind: "dial", cast: "", view: { type: "graph", fn: "line", pts: [[0, 0], [2, 5]], win: [-1, 7, -1, 7] }, dials: [["Slope", 0, 5, 0.5, 1], ["Start", 0, 4, 1, 1]], ans: [2.5, 0], trap: [5, 0], why: "5 is the height of the star. The slope is 5 up for 2 across.", win: "Slope 2.5, starting at the origin." },
    { say: "Key in the slope of the line.", q: "A line goes through (0, 0) and (4, 10).", ans: "2.5", trap: "0.4", why: "That is run over rise. Slope is rise over run: 10 ÷ 4.", win: "10 ÷ 4 = 2.5." },
    { say: "Find the slope by yourself.", alt: [{ q: "A line goes through (0, 0) and (5, 20).", ans: "4", trap: "0.25" }, { q: "A line goes through (0, 0) and (2, 7).", ans: "3.5", trap: "7" }, { q: "A line goes through (0, 0) and (4, 6).", ans: "1.5", trap: "6" }] },
  ],
}));
