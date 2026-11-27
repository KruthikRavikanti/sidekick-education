// Stretch the Sentence. Skill L.2.1-6.
// Producing, expanding and rearranging complete simple and compound sentences. Writing run-on sentences is the known slip.
Sidekick.game(Sidekick.play({
  title: "Stretch the Sentence",
  emoji: "🐕",
  premise: "A short sentence can grow. Add words that tell which one, how, where and when.",
  outro: "Expand a sentence with details, and keep each sentence complete.",
  scene: "meadow",
  kind: "row",
  hint: "Start with who. Then what they did. Then where or when.",
  tag: "run_on_sentences",
  rounds: [
    { say: "Build a longer sentence from The dog barked.", seq: "The little dog|barked loudly|at the mail truck.", trap: "barked loudly|The little dog|at the mail truck.", why: "Start with who the sentence is about.", win: "Which dog, how, and at what." },
    { say: "Join two short sentences into one with the word and.", read: "The cat napped. The dog played.", seq: "The cat napped,|and|the dog played.", trap: "and|The cat napped,|the dog played.", why: "And goes in the middle, between the two ideas.", win: "Two ideas, one sentence." },
    { say: "Build a longer sentence by yourself.", alt: [{ seq: "My big sister|rode her bike|to the park|after lunch.", trap: "rode her bike|My big sister|to the park|after lunch." }, { seq: "The sleepy owl|sat quietly|in the old tree|all day.", trap: "sat quietly|The sleepy owl|in the old tree|all day." }] },
  ],
}));
