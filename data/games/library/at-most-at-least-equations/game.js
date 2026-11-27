// At Most, At Least Equations. Skill A-CED.A.1-1.
// Creating linear equations and inequalities in one variable from situations. Reversing the inequality direction is the known slip.
Sidekick.game(Sidekick.play({
  title: "At Most, At Least Equations",
  emoji: "📱",
  premise: "A situation with a limit becomes an inequality. At most means ≤. At least means ≥. Exactly means =.",
  outro: "Translate the words into an equation or inequality in one variable.",
  scene: "city",
  kind: "fill",
  fs: 5,
  cast: "",
  hint: "Can the total go over the number, or must it stay under?",
  tag: "reverses_inequality",
  rounds: [
    { say: "A phone plan costs $30 plus $5 per GB. Match each limit.", rows: [["spend at most $60", "30 + 5g ≤ 60"], ["spend exactly $60", "30 + 5g = 60"]], extra: "30 + 5g ≥ 60|", trap: [0, "30 + 5g ≥ 60"], why: "At most 60 means the cost cannot go above 60.", win: "At most is ≤." },
    { say: "Match each situation.", rows: [["start with $50, add $15 a week, reach at least $200", "50 + 15w ≥ 200"], ["8 riders per car, fewer than 40 riders", "8c < 40"]], extra: "50 + 15w ≤ 200|", trap: [0, "50 + 15w ≤ 200"], why: "At least 200 means 200 or more.", win: "At least is ≥." },
    { say: "Match these by yourself.", rows: [["a taxi: $4 plus $2 a mile, no more than $20", "4 + 2m ≤ 20"], ["0.5 km per lap, at least 3 km", "0.5n ≥ 3"]], extra: "4 + 2m ≥ 20|0.5n ≤ 3", trap: [0, "4 + 2m ≥ 20"] },
  ],
}));
