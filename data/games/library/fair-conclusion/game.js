// Fair Conclusion?. Skill 7.SP.B.4-2.
// Drawing informal comparative inferences about two populations. Overstating conclusions from small differences is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fair Conclusion?",
  emoji: "⚖️",
  premise: "Data supports some conclusions and not others. A tiny difference from a small sample does not prove much.",
  outro: "Match the strength of a conclusion to the size of the difference and of the sample.",
  scene: "desk",
  kind: "sort",
  fs: 4.6,
  hint: "Is the difference big compared with the spread and the sample size?",
  tag: "overstates_conclusion",
  rounds: [
    { say: "Read the note. Which conclusions are fair?", q: "Samples of 10 · Class A mean 80.2 · Class B mean 80.0", bins: "Fair|Too strong", items: ["The classes scored about the same|More data would help tell them apart", "Class A is clearly smarter|Class A will always score higher"], trap: ["Class A is clearly smarter", 0], why: "A difference of 0.2 from only 10 students could easily be chance.", win: "Small difference, careful conclusion." },
    { say: "Which conclusions are fair?", q: "Samples of 100 · Brand X lasts 40 h · Brand Y lasts 30 h · MAD 2 each", bins: "Fair|Too strong", items: ["X batteries tend to last longer|The difference is large next to the spread", "Every X beats every Y|Y batteries never work"], trap: ["Every X beats every Y", 0], why: "Tend to is fair. Every single one goes further than the data.", win: "Strong data, but still say tends to." },
    { say: "Sort these by yourself.", q: "Samples of 8 · Team 1 mean 5.1 goals · Team 2 mean 5.0 goals", bins: "Fair|Too strong", items: ["The teams look about equal|A bigger sample would help", "Team 1 is far better|Team 2 can never win"], trap: ["Team 1 is far better", 0] },
  ],
}));
