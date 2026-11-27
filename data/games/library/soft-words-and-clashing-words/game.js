// Soft Words and Clashing Words. Skill L.9-10.5-1.
// Interpreting figures of speech such as euphemism and oxymoron in context. Missing them is the known slip.
Sidekick.game(Sidekick.play({
  title: "Soft Words and Clashing Words",
  emoji: "🎭",
  premise: "A euphemism swaps a harsh idea for a gentle phrase. An oxymoron joins two words that seem to contradict each other.",
  outro: "Euphemism: a mild phrase for something harsh. Oxymoron: two opposite words paired for effect.",
  scene: "night",
  kind: "sort",
  fs: 5,
  hint: "Is it softening something hard, or pairing opposites?",
  tag: "misses_figure",
  rounds: [
    { say: "Euphemism or oxymoron?", bins: "Euphemism|Oxymoron", items: ["passed away|let go from the job", "deafening silence|bittersweet"], trap: ["deafening silence", 0], why: "Deafening and silence are opposites placed side by side.", win: "Soften, or clash." },
    { say: "What does each one really mean or suggest?", kind: "fill", fs: 4.6, cast: "", rows: [["between jobs", "unemployed"], ["pre-owned car", "used car"], ["living dead", "alive yet lifeless"]], extra: "very busy|", trap: [0, "very busy"], why: "Between jobs is a gentle way to say out of work.", win: "Read past the soft wording." },
    { say: "Sort these by yourself.", bins: "Euphemism|Oxymoron", items: ["put to sleep|economical with the truth|senior citizen", "cruel kindness|organized chaos"], trap: ["cruel kindness", 0] },
  ],
}));
