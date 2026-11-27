// Same Topic, Different Angle. Skill RI.7.9-1.
// Analyzing how two authors writing about the same topic shape their presentations by emphasizing different evidence. Summarizing both instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "Same Topic, Different Angle",
  emoji: "🔭",
  premise: "Two authors can write about the same topic and stress different facts. What each chooses shapes what you believe.",
  outro: "Analyze how two authors emphasize different evidence or interpret facts differently.",
  scene: "city",
  kind: "sort",
  fs: 4.4,
  hint: "Which author would choose this fact to make their point?",
  tag: "summarizes_both",
  rounds: [
    { say: "Author A praises a new dam. Author B criticizes it. Who stresses each fact?", bins: "Author A|Author B", items: ["The dam powers 80,000 homes.|It ended yearly floods downstream.", "Three villages were moved to build it.|Salmon can no longer reach their streams."], trap: ["Three villages were moved to build it.", 0], why: "Moved villages are a cost. The critic would stress that.", win: "Each author picks the facts that fit." },
    { say: "Author A favors homework. Author B opposes it. Who stresses each fact?", bins: "Author A|Author B", items: ["Practice at home raises math scores.|It builds study habits for later.", "Students report less sleep on heavy nights.|Family time shrinks during the week."], trap: ["Students report less sleep on heavy nights.", 0], why: "Lost sleep is a reason against homework.", win: "Benefits on one side, costs on the other." },
    { say: "Author A supports a new stadium. Author B opposes it. Sort by yourself.", bins: "Author A|Author B", items: ["It would bring 400 jobs.|Visitors would fill local hotels.", "Taxes would rise to pay for it.|Game-day traffic would clog the streets."], trap: ["Taxes would rise to pay for it.", 0] },
  ],
}));
