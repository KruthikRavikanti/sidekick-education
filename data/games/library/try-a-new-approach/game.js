// Try a New Approach. Skill W.5.5-1.
// Developing and strengthening writing by planning, revising, editing, rewriting or trying a new approach. Only editing spelling is the known slip.
Sidekick.game(Sidekick.play({
  title: "Try a New Approach",
  emoji: "🔄",
  premise: "Sometimes the best fix is to start a part over in a completely different way, not just to polish it.",
  outro: "Strengthen writing by planning, revising, editing, rewriting, or trying a new approach.",
  scene: "desk",
  kind: "sort",
  hint: "Does the change rethink the writing, or just correct small errors?",
  tag: "only_edits_spelling",
  rounds: [
    { say: "Which changes rethink the writing, and which only tidy it?", bins: "New approach|Small edit", items: ["open with a question instead of a fact|tell it from the dog’s point of view", "fix a spelling slip|add a missing period"], trap: ["fix a spelling slip", 0], why: "That tidies it. A new approach changes how the piece works.", win: "Rethinking versus tidying." },
    { say: "Sort these changes.", bins: "New approach|Small edit", items: ["start at the most exciting moment|turn the report into an interview", "capitalize a name|swap its for it’s"], trap: ["capitalize a name", 0], why: "That is a correction, not a new approach.", win: "Two kinds of improvement." },
    { say: "Sort these by yourself.", bins: "New approach|Small edit", items: ["rewrite the ending as a surprise|reorganize from weakest reason to strongest", "fix a comma|correct a verb tense"], trap: ["correct a verb tense", 0] },
  ],
}));
