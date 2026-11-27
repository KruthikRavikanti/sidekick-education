// Link the Logic. Skill W.9-10.1-3.
// Using words, phrases and clauses to link the major sections of a text and clarify relationships. Writing choppy, unlinked sentences is the known slip.
Sidekick.game(Sidekick.play({
  title: "Link the Logic",
  emoji: "🔗",
  premise: "Transitions are road signs. They tell the reader that you are adding, turning, or arriving at a result.",
  outro: "Use transitions that match the relationship: addition, contrast, cause or result.",
  scene: "desk",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "Is the second sentence more of the same, a turn, or a result?",
  tag: "choppy",
  rounds: [
    { say: "Choose the transition that shows the relationship.", rows: [["The plan saves money. ___, it shortens the commute.", "Moreover"], ["The plan saves money. ___, critics doubt the figures.", "However"], ["The figures hold up. ___, the council should approve it.", "Therefore"]], trap: [1, "Moreover"], why: "Doubt is a turn against the first sentence. It needs a contrast word.", win: "Add, turn, conclude." },
    { say: "Choose the transition.", rows: [["Rain delayed planting. ___, the harvest came late.", "As a result"], ["The harvest came late. ___, yields were high.", "Even so"], ["Yields were high. ___, prices held steady.", "In addition"]], trap: [0, "In addition"], why: "A late harvest is caused by the delay. Show the result.", win: "Cause, contrast, addition." },
    { say: "Choose the transitions by yourself.", rows: [["The test group slept more. ___, their scores rose.", "Consequently"], ["Scores rose. ___, attendance stayed flat.", "Nevertheless"], ["Attendance stayed flat. ___, lateness did not change.", "Likewise"]], trap: [1, "Consequently"] },
  ],
}));
