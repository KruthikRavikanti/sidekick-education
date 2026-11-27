// Read the Rate Graph. Skill 7.RP.A.2-4.
// Explaining what a point (x, y) on the graph of a proportional relationship means, with special attention to (0, 0) and (1, r). Not being able to interpret points in context is the known slip.
Sidekick.game(Sidekick.play({
  title: "Read the Rate Graph",
  emoji: "📈",
  premise: "On the graph of a proportional relationship, two points are special: (0, 0) and (1, r). The r is the unit rate.",
  outro: "The point (1, r) shows the unit rate. The point (0, 0) shows that nothing costs nothing.",
  scene: "paper",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "The first number is the x amount. The second is the y amount that goes with it.",
  tag: "cannot_interpret_points",
  rounds: [
    { say: "The graph shows cost (y) for pounds of apples (x). What does each point mean?", rows: [["(0, 0)", "0 pounds cost $0"], ["(1, 2.5)", "1 pound costs $2.50"], ["(4, 10)", "4 pounds cost $10"]], extra: "2.5 pounds cost $1|", trap: [1, "2.5 pounds cost $1"], why: "x is pounds and comes first: 1 pound, 2.50 dollars.", win: "(1, 2.5) is the unit rate." },
    { say: "The graph shows miles (y) after hours (x). What does each point mean?", rows: [["(0, 0)", "0 hours, 0 miles"], ["(1, 60)", "60 miles per hour"], ["(3, 180)", "180 miles in 3 hours"]], extra: "1 mile in 60 hours|", trap: [1, "1 mile in 60 hours"], why: "x is hours: 1 hour, 60 miles.", win: "(1, 60) gives the speed." },
    { say: "Cost (y) for tickets (x). Match these by yourself.", rows: [["(1, 8)", "$8 per ticket"], ["(0, 0)", "0 tickets cost $0"], ["(5, 40)", "5 tickets cost $40"]], extra: "8 tickets for $1|", trap: [0, "8 tickets for $1"] },
  ],
}));
