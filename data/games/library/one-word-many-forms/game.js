// One Word, Many Forms. Skill L.9-10.4-2.
// Identifying and correctly using patterns of word changes that indicate different meanings or parts of speech. Missing the part-of-speech shift is the known slip.
Sidekick.game(Sidekick.play({
  title: "One Word, Many Forms",
  emoji: "🧬",
  premise: "Words come in families. The ending changes with the job: analyze does, analysis names, analytical describes.",
  outro: "Use patterns of word changes that signal different parts of speech.",
  scene: "desk",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "Is the blank doing an action, naming a thing, or describing?",
  tag: "misses_part_of_speech",
  rounds: [
    { say: "Choose the form that fits each sentence.", rows: [["We will ___ the results.", "analyze"], ["Her ___ of the data was careful.", "analysis"], ["She has an ___ mind.", "analytical"]], trap: [1, "analyze"], why: "After her, the sentence needs a noun: analysis.", win: "Verb, noun, adjective." },
    { say: "Choose the form that fits.", rows: [["They ___ a new route.", "advocate"], ["Her ___ for the park won support.", "advocacy"], ["The plan is ___: it can be done.", "feasible"]], extra: "feasibility", trap: [2, "feasibility"], why: "After is, describing the plan, you need the adjective feasible.", win: "Watch the endings." },
    { say: "Choose the forms by yourself.", rows: [["The author will ___ the two poems.", "compare"], ["The ___ shows a clear difference.", "comparison"], ["The results are ___ to last year’s.", "comparable"]], trap: [1, "compare"] },
  ],
}));
