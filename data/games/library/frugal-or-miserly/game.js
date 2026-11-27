// Frugal or Miserly. Skill L.11-12.5-2.
// Analyzing nuances in the meaning of words with similar denotations. Treating such words as interchangeable is the known slip.
Sidekick.game(Sidekick.play({
  title: "Frugal or Miserly",
  emoji: "🪙",
  premise: "Synonyms are never quite equal. Frugal earns a nod. Miserly earns a frown. The dictionary meaning is the same.",
  outro: "Analyze nuances in the meaning of words with similar denotations.",
  scene: "desk",
  kind: "sort",
  fs: 5.2,
  hint: "Which word would the person choose to describe themselves?",
  tag: "interchanges_words",
  rounds: [
    { say: "Each pair shares a meaning. Which word flatters and which criticizes?", bins: "Flattering|Critical", items: ["frugal|resolute|candid", "miserly|obstinate|blunt"], trap: ["miserly", 0], why: "Miserly suggests hoarding money out of meanness.", win: "Same fact, different verdict." },
    { say: "Choose the word with the right nuance for each sentence.", kind: "fill", fs: 4.6, cast: "", rows: [["We admired her ___ refusal to quit.", "resolute"], ["His ___ refusal to listen cost us the deal.", "obstinate"], ["Thanks for your ___ feedback. It helped.", "candid"]], extra: "blunt", trap: [2, "blunt"], why: "It helped, so the speaker is grateful. Candid praises honesty.", win: "Tone decides the word." },
    { say: "Sort these by yourself.", bins: "Flattering|Critical", items: ["meticulous|ambitious|reserved", "fussy|ruthless|aloof"], trap: ["fussy", 0] },
  ],
}));
