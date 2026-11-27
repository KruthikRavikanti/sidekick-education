// Read the Residuals. Skill S-ID.B.6-2.
// Informally assessing the fit of a function by plotting and analyzing residuals. Thinking a pattern in the residuals means a good fit is the known slip.
Sidekick.game(Sidekick.play({
  title: "Read the Residuals",
  emoji: "📉",
  premise: "A residual is how far a data point sits above or below the fitted line. Residuals from a good model look like random scatter.",
  outro: "Residual = actual − predicted. A pattern in the residuals means the model does not fit.",
  scene: "paper",
  kind: "sort",
  fs: 4.8,
  hint: "Random scatter around zero is good. A curve or a trend is a warning.",
  tag: "pattern_means_good_fit",
  rounds: [
    { say: "What does each residual plot say about the model?", bins: "Good fit|Poor fit", items: ["residuals scattered randomly around 0|small residuals, some above and some below", "residuals form a U shape|residuals climb steadily from left to right"], trap: ["residuals form a U shape", 0], why: "A U shape is a pattern. The line is missing a curve in the data.", win: "No pattern is the goal." },
    { say: "The actual value is 12 and the model predicted 10. Key in the residual.", kind: "type", icon: "📉", ans: 2, trap: -2, why: "Residual is actual minus predicted: 12 − 10.", win: "12 − 10 = 2." },
    { say: "Sort these by yourself.", bins: "Good fit|Poor fit", items: ["residuals look like random dots near 0|about half positive and half negative, no pattern", "residuals curve like an arch|every residual is positive"], trap: ["residuals curve like an arch", 0] },
  ],
}));
