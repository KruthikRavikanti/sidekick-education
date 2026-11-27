// Rewrite, Not Just Polish. Skill W.8.5-1.
// Developing and strengthening writing by planning, revising, editing, rewriting or trying a new approach. Only editing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Rewrite, Not Just Polish",
  emoji: "🔨",
  premise: "Sometimes a draft needs a new approach, not a tidy-up. Rewriting changes the plan. Polishing fixes the surface.",
  outro: "Strengthen writing by revising, rewriting or trying a new approach, then editing.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Does this change the approach, or only tidy what is there?",
  tag: "only_edits",
  rounds: [
    { say: "A weak paragraph needs work. Which changes are a real rewrite?", bins: "A real rewrite|Only a touch-up", items: ["open with a story in place of a definition|reorganize from problem to solution", "fix two commas|swap one word for a synonym"], trap: ["swap one word for a synonym", 0], why: "One new word leaves the approach exactly the same.", win: "Rewriting changes the plan." },
    { say: "Sort these.", bins: "A real rewrite|Only a touch-up", items: ["switch the narrator from third person to first|cut the first page and start at the action", "capitalize a title|correct a spelling slip"], trap: ["capitalize a title", 0], why: "That is editing. The piece is otherwise untouched.", win: "New approach first, then edit." },
    { say: "Sort these by yourself.", bins: "A real rewrite|Only a touch-up", items: ["turn the essay into a letter to the mayor|build the argument around a new main reason", "add a period|fix an apostrophe"], trap: ["add a period", 0] },
  ],
}));
