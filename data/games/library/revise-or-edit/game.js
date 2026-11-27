// Revise or Edit?. Skill W.6.5-1.
// Developing and strengthening writing by planning, revising, editing and rewriting. Only editing, never revising, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Revise or Edit?",
  emoji: "🛠️",
  premise: "Revising changes the ideas: what you say and in what order. Editing fixes the surface: spelling, commas, capitals.",
  outro: "Revise first for ideas and organization. Edit last for spelling and punctuation.",
  scene: "desk",
  kind: "sort",
  fs: 4.6,
  hint: "Does this change what the writing says, or only how it is spelled and punctuated?",
  tag: "only_edits",
  rounds: [
    { say: "Is each change revising or editing?", bins: "Revising|Editing", items: ["add an example to the second paragraph|move the best reason to the end", "fix the spelling of because|add a missing period"], trap: ["add an example to the second paragraph", 1], why: "A new example changes the ideas. That is revising.", win: "Ideas are revised. Mechanics are edited." },
    { say: "Sort these.", bins: "Revising|Editing", items: ["cut a paragraph that drifts off topic|rewrite the opening to be clearer", "capitalize the title|change their to there"], trap: ["cut a paragraph that drifts off topic", 1], why: "Cutting a whole paragraph changes the content.", win: "Big changes first, small fixes last." },
    { say: "Sort these by yourself.", bins: "Revising|Editing", items: ["add a stronger conclusion|explain a confusing step", "fix a comma|correct a misspelled name"], trap: ["add a stronger conclusion", 1] },
  ],
}));
