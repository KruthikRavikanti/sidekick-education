// Real Revision. Skill W.4.5-1.
// Developing and strengthening writing through planning, revising and editing. Revising only the spelling is the known slip.
Sidekick.game(Sidekick.play({
  title: "Real Revision",
  emoji: "✂️",
  premise: "Revising is more than fixing spelling. Add what is missing, cut what does not fit, and move what is out of place.",
  outro: "Revise by adding, cutting and rearranging. Edit for spelling and punctuation afterward.",
  scene: "desk",
  kind: "sort",
  hint: "Does the change improve the ideas, or correct a small error?",
  tag: "revises_only_spelling",
  rounds: [
    { say: "Is each change revising or editing?", bins: "Revising|Editing", items: ["add a detail about the storm|cut a sentence that is off topic", "fix a misspelled word|add a missing comma"], trap: ["cut a sentence that is off topic", 1], why: "Cutting changes the content. That is revising.", win: "Revise the ideas, edit the errors." },
    { say: "Sort these changes.", bins: "Revising|Editing", items: ["move the best reason to the end|replace a vague word", "capitalize a name|fix a run-on sentence"], trap: ["replace a vague word", 1], why: "Choosing a better word improves the writing itself. That is revising.", win: "Two kinds of improvement." },
    { say: "Sort these by yourself.", bins: "Revising|Editing", items: ["add a stronger ending|combine two choppy sentences|explain a confusing part", "fix their and there|add a period"], trap: ["explain a confusing part", 1] },
  ],
}));
