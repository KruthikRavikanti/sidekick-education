// Revise Before You Polish. Skill W.9-10.5-1.
// Developing and strengthening writing by planning, revising, editing and rewriting. Only editing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Revise Before You Polish",
  emoji: "🛠️",
  premise: "Fixing commas is the last step. Real revision asks bigger questions first: does this serve the purpose and the reader?",
  outro: "Plan, revise, edit and rewrite, focusing first on what matters most for purpose and audience.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Does it change the ideas and structure, or only the surface?",
  tag: "only_edits",
  rounds: [
    { say: "Revising, or editing?", bins: "Revising: big changes|Editing: surface fixes", items: ["cut a paragraph that drifts off topic|add an example the reader needs", "fix a comma splice|correct a misspelled name"], trap: ["cut a paragraph that drifts off topic", 1], why: "Removing a whole paragraph reshapes the piece. That is revision.", win: "Ideas first, commas last." },
    { say: "Put the writing process in order.", kind: "row", fs: 4.6, seq: "Plan|Draft|Revise|Edit|Publish", trap: "Plan|Draft|Edit|Revise|Publish", why: "Polishing sentences you may cut is wasted work. Revise first.", win: "Revise, then edit." },
    { say: "Sort these by yourself.", bins: "Revising: big changes|Editing: surface fixes", items: ["reorder the points so the strongest comes last|rewrite the opening for a younger audience", "capitalize a proper noun|change its to it’s"], trap: ["rewrite the opening for a younger audience", 1] },
  ],
}));
