// Word Families at Work. Skill L.11-12.4-2.
// Identifying and correctly using patterns of word changes that indicate different meanings or parts of speech. Missing the shift is the known slip.
Sidekick.game(Sidekick.play({
  title: "Word Families at Work",
  emoji: "🧬",
  premise: "Know one member of a word family and you can work out the rest. The suffix tells you its job in the sentence.",
  outro: "Use patterns of word changes that signal different meanings or parts of speech: conceive, conception, conceivable.",
  scene: "desk",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "Does the blank need an action, a thing, or a describing word?",
  tag: "misses_part_of_speech",
  rounds: [
    { say: "Choose the form that fits each sentence.", rows: [["She could not ___ of a better plan.", "conceive"], ["The ___ of the idea took years.", "conception"], ["It is ___ that we will finish early.", "conceivable"]], trap: [1, "conceive"], why: "After the, the sentence needs a noun: conception.", win: "Verb, noun, adjective." },
    { say: "Choose the form that fits.", rows: [["The data ___ the earlier claim.", "contradict"], ["There is a ___ between the two reports.", "contradiction"], ["The two reports are ___.", "contradictory"]], trap: [2, "contradiction"], why: "After are, describing the reports, use the adjective.", win: "Suffixes mark the job." },
    { say: "Choose the forms by yourself.", rows: [["We must ___ between fact and rumor.", "distinguish"], ["The ___ is subtle.", "distinction"], ["Her style is ___.", "distinctive"]], trap: [0, "distinction"] },
  ],
}));
