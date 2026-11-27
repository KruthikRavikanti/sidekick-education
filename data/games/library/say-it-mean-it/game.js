// Say It, Mean It. Skill L.5.4-3.
// Consulting reference materials to find the pronunciation and determine the precise meaning of key words. Picking the incorrect definition is the known slip.
Sidekick.game(Sidekick.play({
  title: "Say It, Mean It",
  emoji: "🔊",
  premise: "A dictionary shows how to say a word and lists its meanings. Check both, and pick the meaning that fits.",
  outro: "Use references to find a word’s pronunciation and the definition that fits the context.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "Read the whole entry. Which meaning fits the sentence?",
  tag: "picks_unfit_definition",
  rounds: [
    { say: "Use the entry to answer.", fig: { type: "table", rows: [["debris", "duh-BREE"], ["meaning", "scattered broken pieces"]] }, rows: [["How it is said", "duh-BREE"], ["What it means", "scattered broken pieces"]], extra: "DEB-riss|", trap: [0, "DEB-riss"], why: "The entry shows duh-BREE. The s is silent.", win: "Said duh-BREE. It means scattered pieces." },
    { say: "The word desert has two entries. Which fits each sentence?", fig: { type: "table", rows: [["DEZ-ert", "a dry, sandy region"], ["dih-ZERT", "to leave or abandon"]] }, rows: [["Cactus grows in the desert.", "a dry, sandy region"], ["He would never desert his friends.", "to leave or abandon"]], extra: "a sweet treat|", trap: [1, "a dry, sandy region"], why: "He would never do something to his friends. That is the verb: to abandon.", win: "One spelling, two words." },
    { say: "The word content has two entries. Match by yourself.", fig: { type: "table", rows: [["KON-tent", "what is inside"], ["kun-TENT", "satisfied"]] }, rows: [["The content of the box was a mystery.", "what is inside"], ["The cat looked content by the fire.", "satisfied"]], extra: "angry|a camping shelter", trap: [1, "what is inside"] },
  ],
}));
