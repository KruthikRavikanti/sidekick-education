// Whole Sentence Check. Skill L.K.1-6.
// Producing complete sentences: word groups are sorted into whole sentences and fragments. Using fragments is the known slip.
Sidekick.game(Sidekick.play({
  title: "Whole Sentence Check",
  emoji: "✅",
  premise: "A whole sentence tells who and what they do. Just a few words are not enough.",
  outro: "A complete sentence has a who or what, and tells what it does.",
  scene: "paper",
  kind: "sort",
  hint: "Does it tell who AND what they do?",
  tag: "uses_fragments",
  rounds: [
    { say: "Is it a whole sentence?", bins: "Whole sentence|Not whole", items: ["The dog runs.|I like milk.", "The dog|runs fast"], trap: ["The dog", 0], why: "The dog does what? It needs a doing part.", win: "A who and a what." },
    { say: "Sort these.", bins: "Whole sentence|Not whole", items: ["Mom is home.|We play ball.", "my red hat|in the box"], trap: ["my red hat", 0], why: "What about my red hat? Nothing happens yet.", win: "Whole sentences tell a full idea." },
    { say: "Sort these by yourself.", bins: "Whole sentence|Not whole", items: ["The cat naps.|I see a bug.|Birds can fly.", "a big bug|on the bed"], trap: ["a big bug", 0] },
  ],
}));
