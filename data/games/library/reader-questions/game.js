// Reader Questions. Skill W.1.5-1.
// Responding to questions and suggestions from peers and adding details to strengthen writing. Ignoring the feedback is the known slip.
Sidekick.game(Sidekick.play({
  title: "Reader Questions",
  emoji: "❔",
  premise: "A reader asks questions about your story. Answer each one by adding a detail to your sentence.",
  outro: "Use questions from readers to add details to your writing.",
  scene: "paper",
  kind: "fill",
  cast: "",
  hint: "Which sentence answers that question?",
  tag: "ignores_feedback",
  rounds: [
    { say: "You wrote: The dog ran. Pick the sentence that answers each reader question.", rows: [["What did the dog look like?", "The big brown dog ran."], ["Where did it run?", "The dog ran to the park."]], extra: "The dog ran.|", trap: [0, "The dog ran."], why: "That is the same as before. Add what the dog looked like.", win: "Now the reader can picture it." },
    { say: "You wrote: We ate. Pick the sentence that answers each question.", rows: [["What did you eat?", "We ate hot soup."], ["When did you eat?", "We ate at noon."]], extra: "We ate.|", trap: [1, "We ate."], why: "That does not say when. Add the time.", win: "Details answer the questions." },
    { say: "You wrote: I saw a bird. Answer each question by yourself.", rows: [["What color was it?", "I saw a blue bird."], ["Where was it?", "I saw a bird in a tree."]], extra: "I saw a bird.|I saw it.", trap: [0, "I saw a bird."] },
  ],
}));
