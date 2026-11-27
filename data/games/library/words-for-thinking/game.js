// Words for Thinking. Skill L.7.6-1.
// Acquiring and using grade-appropriate general academic and domain-specific words. Avoiding them is the known slip.
Sidekick.game(Sidekick.play({
  title: "Words for Thinking",
  emoji: "🧠",
  premise: "Infer, contrast, evaluate: these words name kinds of thinking. Use them and your writing sounds sure of itself.",
  outro: "Academic words name precise thinking moves across every subject.",
  scene: "desk",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "What kind of thinking does the sentence describe?",
  tag: "avoids_academic_words",
  rounds: [
    { say: "Drop in the academic word that fits.", rows: [["From her shaking hands, we can ___ that she is nervous.", "infer"], ["The essay will ___ city life with country life.", "contrast"]], extra: "decorate", trap: [0, "contrast"], why: "Working something out from clues is inferring.", win: "Infer from clues. Contrast two things." },
    { say: "Drop in the word that fits.", rows: [["Judges ___ each project on creativity.", "evaluate"], ["One ___ of the drought was higher food prices.", "consequence"], ["Her results ___ the earlier study.", "support"]], trap: [1, "evaluate"], why: "Higher prices resulted from the drought. A result is a consequence.", win: "Evaluate, consequence, support." },
    { say: "Fill these by yourself.", rows: [["Scientists ___ the cause to warmer water.", "attribute"], ["The two graphs ___ each other.", "contradict"], ["Please ___ your claim with an example.", "illustrate"]], extra: "paint", trap: [2, "paint"] },
  ],
}));
