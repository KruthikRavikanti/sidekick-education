// Plan, Revise, Edit. Skill W.3.5-1.
// Developing and strengthening writing by planning, revising and editing. Only fixing spelling is the known slip.
Sidekick.game(Sidekick.play({
  title: "Plan, Revise, Edit",
  emoji: "🧰",
  premise: "Writing happens in stages. Plan before you write. Revise to make the ideas better. Edit to fix the errors.",
  outro: "Plan first, revise the ideas, then edit the mistakes.",
  scene: "desk",
  kind: "sort",
  hint: "Is it getting ready, improving the ideas, or fixing errors?",
  tag: "only_fixes_spelling",
  rounds: [
    { say: "Which stage is each job?", bins: "Plan|Revise|Edit", items: ["list your ideas|", "add a stronger detail|", "fix a spelling slip|"], trap: ["add a stronger detail", 2], why: "A new detail changes the ideas. That is revising.", win: "Plan, revise, edit." },
    { say: "Sort these jobs.", bins: "Plan|Revise|Edit", items: ["draw a story map|", "move a sentence to a better spot|cut a part that does not fit", "add a missing capital|"], trap: ["cut a part that does not fit", 2], why: "Cutting a part changes the content. That is revising.", win: "Ideas before errors." },
    { say: "Sort these by yourself.", bins: "Plan|Revise|Edit", items: ["choose your topic|", "swap a dull word for a vivid one|", "add a comma|fix a run-on"], trap: ["swap a dull word for a vivid one", 2] },
  ],
}));
