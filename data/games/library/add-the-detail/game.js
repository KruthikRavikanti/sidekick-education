// Add the Detail. Skill W.K.5-1.
// Responding to questions and suggestions by adding details to strengthen writing. Leaving the writing unchanged is the known slip.
Sidekick.game(Sidekick.play({
  title: "Add the Detail",
  emoji: "🖍️",
  premise: "A friend asks a question about your writing. Make it stronger by adding the answer.",
  outro: "When a reader asks a question, add that detail to your writing.",
  scene: "paper",
  kind: "pick",
  hint: "Which sentence answers the question?",
  tag: "does_not_change_writing",
  rounds: [
    { say: "You wrote: I have a dog. A friend asks: What color is it? Tap the better sentence.", yes: "I have a brown dog.|", no: "I have a dog.|I have a cat.|Dog.", trap: "I have a dog.", why: "That is the same as before. Add the color.", win: "Now the reader knows the color." },
    { say: "You wrote: We went to a place. A friend asks: Where? Tap the better sentence.", yes: "We went to the zoo.|", no: "We went to a place.|We went.|It was a place.", trap: "We went to a place.", why: "That is the same as before. Say where.", win: "Now the reader knows where." },
    { say: "You wrote: I ate a snack. A friend asks: What snack? Tap the better sentence.", yes: "I ate a red apple.|", no: "I ate a snack.|I ate.|A snack.|I had a snack to eat.|Snack time.", trap: "I ate a snack." },
  ],
}));
