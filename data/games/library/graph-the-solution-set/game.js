// Graph the Solution Set. Skill 7.EE.B.4-4.
// Graphing the solution set of an inequality and interpreting it in context. Using the reversed direction or the other circle is the known slip.
Sidekick.game(Sidekick.play({
  title: "Graph the Solution Set",
  emoji: "🎚️",
  premise: "The solutions of an inequality fill part of the number line. The graph shows where they start and which way they go.",
  outro: "Open circle when the endpoint is not a solution, filled when it is. The arrow covers every solution.",
  scene: "paper",
  kind: "fill",
  figW: 20,
  cast: "",
  hint: "Is the endpoint included? Which side holds numbers that work?",
  tag: "reversed_circle_or_direction",
  rounds: [
    { say: "Match each inequality to its graph.", rows: [["x < −4", "~ineq:o:l:-4"], ["x ≥ −4", "~ineq:c:r:-4"]], extra: "~ineq:o:r:-4", trap: [0, "~ineq:o:r:-4"], why: "Numbers less than −4 are to the LEFT of −4.", win: "Left for less, filled when equal counts." },
    { say: "h is hours of practice. Match each rule to its graph.", rows: [["at least 5 hours", "~ineq:c:r:5"], ["fewer than 5 hours", "~ineq:o:l:5"], ["more than 5 hours", "~ineq:o:r:5"]], extra: "~ineq:c:l:5", trap: [0, "~ineq:o:r:5"], why: "At least 5 includes 5 itself, so the circle is filled.", win: "Three rules, three graphs." },
    { say: "Match these by yourself.", rows: [["x ≤ 2", "~ineq:c:l:2"], ["x > 2", "~ineq:o:r:2"], ["x < 2", "~ineq:o:l:2"]], extra: "~ineq:c:r:2", trap: [0, "~ineq:c:r:2"] },
  ],
}));
