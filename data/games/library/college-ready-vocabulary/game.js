// College-Ready Vocabulary. Skill L.11-12.6-1.
// Acquiring and using accurately general academic and domain-specific words and phrases at the college and career readiness level. Avoiding them is the known slip.
Sidekick.game(Sidekick.play({
  title: "College-Ready Vocabulary",
  emoji: "🎓",
  premise: "A handful of academic words carry most scholarly writing. Use them precisely and your own writing gains authority.",
  outro: "Acquire and use academic and domain-specific words accurately at the college and career level.",
  scene: "desk",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "Try each word in the blank. Which one makes exact sense?",
  tag: "avoids_academic_words",
  rounds: [
    { say: "Choose the word that fits.", rows: [["You must ___ that claim with evidence.", "substantiate"], ["The essay captures every ___ of the debate.", "nuance"], ["The findings ___ earlier research.", "corroborate"]], trap: [1, "substantiate"], why: "A fine shade of meaning is a nuance. It is a noun.", win: "Prove, shade of meaning, confirm." },
    { say: "Choose the word that fits.", rows: [["The policy had an ___ effect: it backfired.", "unintended"], ["Her argument rests on a false ___.", "premise"], ["Critics ___ that the sample was too small.", "contend"]], trap: [2, "premise"], why: "Critics do something here. Contend means to argue.", win: "Words for arguments." },
    { say: "Choose the words by yourself.", rows: [["The author’s tone is hard to ___.", "discern"], ["Two ___ factors shaped the result.", "salient"], ["The theory is ___ with the data.", "consistent"]], extra: "nuance", trap: [0, "nuance"] },
  ],
}));
