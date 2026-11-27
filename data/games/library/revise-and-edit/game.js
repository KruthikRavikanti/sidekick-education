// Revise and Edit. Skill W.2.5-1.
// Strengthening writing by revising and editing. Only recopying neatly is the known slip.
Sidekick.game(Sidekick.play({
  title: "Revise and Edit",
  emoji: "🛠️",
  premise: "Revising makes your ideas better. Editing fixes spelling, capitals and end marks. Just copying it neatly does neither.",
  outro: "Revise to improve the ideas. Edit to fix the mistakes.",
  scene: "desk",
  kind: "sort",
  hint: "Does it change the ideas, fix an error, or change nothing?",
  tag: "only_recopies",
  rounds: [
    { say: "Sort each change to a story.", bins: "Revising|Editing|No real change", items: ["add a detail about the dog|", "fix a spelling slip|", "copy it again neatly|"], trap: ["copy it again neatly", 0], why: "Copying makes it neater, but the writing itself stays the same.", win: "Revise, edit, or no change." },
    { say: "Sort these changes.", bins: "Revising|Editing|No real change", items: ["swap a dull word for a strong one|", "add a missing period|", "write it in blue pen|"], trap: ["add a missing period", 0], why: "A period is punctuation. Fixing it is editing.", win: "Ideas, then errors." },
    { say: "Sort these by yourself.", bins: "Revising|Editing|No real change", items: ["add how you felt|", "make the first letter a capital|fix a spelling slip", "make your letters rounder|"], trap: ["make your letters rounder", 0] },
  ],
}));
