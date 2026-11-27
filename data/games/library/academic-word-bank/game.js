// Academic Word Bank. Skill L.8.6-1.
// Acquiring and using grade-appropriate general academic and domain-specific words and phrases. Avoiding them is the known slip.
Sidekick.game(Sidekick.play({
  title: "Academic Word Bank",
  emoji: "🏦",
  premise: "Words like evaluate and perspective turn up in every subject. Using them precisely shows clear thinking.",
  outro: "Use academic vocabulary accurately when reading, writing and speaking.",
  scene: "desk",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "Read the whole sentence. Which word names that kind of thinking?",
  tag: "avoids_academic_words",
  rounds: [
    { say: "Drop in the academic word that fits.", rows: [["We must ___ whether the source is reliable.", "evaluate"], ["The story is told from a child’s ___.", "perspective"]], extra: "celebrate", trap: [1, "evaluate"], why: "A point of view is a perspective.", win: "Evaluate a source. A child’s perspective." },
    { say: "Drop in the word that fits.", rows: [["The data ___ a link between sleep and grades.", "indicates"], ["Her essay will ___ two theories.", "synthesize"], ["A key ___ is that all students have phones.", "assumption"]], trap: [2, "indicates"], why: "Something taken for granted is an assumption.", win: "Indicates, synthesize, assumption." },
    { say: "Fill these by yourself.", rows: [["The author’s ___ toward the plan is critical.", "stance"], ["Rising seas could ___ coastal towns.", "impact"], ["Please ___ your reasoning step by step.", "justify"]], extra: "bake", trap: [0, "bake"] },
  ],
}));
