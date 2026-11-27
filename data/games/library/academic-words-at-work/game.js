// Academic Words at Work. Skill L.9-10.6-1.
// Acquiring and using general academic and domain-specific words and phrases. Avoiding them is the known slip.
Sidekick.game(Sidekick.play({
  title: "Academic Words at Work",
  emoji: "🎓",
  premise: "Certain words show up in every subject: synthesize, implication, evaluate. Knowing them unlocks textbooks and test questions.",
  outro: "Acquire and use general academic and domain-specific words accurately.",
  scene: "desk",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "Try each word in the blank. Which makes exact sense?",
  tag: "avoids_academic_words",
  rounds: [
    { say: "Choose the word that fits.", rows: [["The report will ___ findings from three studies.", "synthesize"], ["One ___ of the ruling is higher costs.", "implication"], ["Judges ___ each entry against the rubric.", "evaluate"]], trap: [0, "evaluate"], why: "Combining three studies into one account is synthesizing.", win: "Combine, consequence, judge." },
    { say: "Choose the word that fits.", rows: [["The new data ___ the earlier theory.", "corroborate"], ["Her tone is hard to ___ from one line.", "infer"], ["The two results are ___: they disagree.", "inconsistent"]], trap: [0, "infer"], why: "Data that support a theory corroborate it.", win: "Support, conclude, clash." },
    { say: "Choose the words by yourself.", rows: [["Please ___ your answer with evidence.", "justify"], ["The essay offers a new ___ on the war.", "perspective"], ["These factors ___ to the delay.", "contribute"]], extra: "synthesize", trap: [0, "synthesize"] },
  ],
}));
