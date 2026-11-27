// School Power Words. Skill L.6.6-1.
// Acquiring and using grade-appropriate general academic and domain-specific words. Avoiding new words is the known slip.
Sidekick.game(Sidekick.play({
  title: "School Power Words",
  emoji: "🎓",
  premise: "Some words show up in every subject: analyze, evidence, summarize. Knowing them unlocks directions and questions.",
  outro: "Academic words name the thinking a task asks for.",
  scene: "desk",
  kind: "fill",
  fs: 4.8,
  cast: "",
  hint: "What is the sentence asking someone to do?",
  tag: "avoids_new_words",
  rounds: [
    { say: "Drop in the academic word that fits.", rows: [["We will ___ the data to look for patterns.", "analyze"], ["She gave ___ from the text to prove her point.", "evidence"]], extra: "decorate", trap: [0, "decorate"], why: "Looking closely for patterns is analyzing.", win: "Analyze the data. Give evidence." },
    { say: "Drop in the word that fits.", rows: [["Please ___ the chapter in two sentences.", "summarize"], ["___ the two poems: how are they alike?", "Compare"], ["Scientists ___ that the ice will melt.", "predict"]], trap: [1, "summarize"], why: "Looking at how two things are alike is comparing.", win: "Summarize, compare, predict." },
    { say: "Fill these by yourself.", rows: [["One ___ of the storm was a flooded road.", "effect"], ["What can you ___ from these clues?", "infer"], ["Use a ___ you can trust for your facts.", "source"]], extra: "recess", trap: [1, "recess"] },
  ],
}));
