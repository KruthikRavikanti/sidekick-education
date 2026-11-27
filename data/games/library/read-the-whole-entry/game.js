// Read the Whole Entry. Skill L.9-10.4-3.
// Consulting reference materials to find the pronunciation, meaning, part of speech or etymology of a word. Choosing an unfitting meaning is the known slip.
Sidekick.game(Sidekick.play({
  title: "Read the Whole Entry",
  emoji: "📖",
  premise: "A dictionary entry holds more than a definition. It gives the part of speech and where the word came from.",
  outro: "Use reference materials to find a word’s meaning, part of speech and etymology.",
  scene: "desk",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "Find the label in the entry that answers the question.",
  tag: "picks_unfitting_meaning",
  rounds: [
    { say: "Use the entry to answer each question.", fig: { type: "table", rows: [["word", "democracy"], ["part of speech", "noun"], ["origin", "Greek: demos (people) + kratos (rule)"], ["meaning", "rule by the people"]], v: [] }, rows: [["part of speech", "noun"], ["etymology", "from Greek for rule by the people"]], extra: "verb|", trap: [0, "verb"], why: "The entry labels it a noun. It names a system.", win: "Label by label." },
    { say: "Bank has two entries. Which meaning fits each sentence?", fig: { type: "table", rows: [["bank (1)", "noun: a place that keeps money"], ["bank (2)", "noun: the land beside a river"]], v: [] }, rows: [["We fished from the bank.", "the land beside a river"], ["She opened an account at the bank.", "a place that keeps money"]], extra: "a seat in a park|", trap: [0, "a place that keeps money"], why: "You fish beside water. Use the meaning that fits the sentence.", win: "Context picks the entry." },
    { say: "Use the entry by yourself.", fig: { type: "table", rows: [["word", "benevolent"], ["part of speech", "adjective"], ["origin", "Latin: bene (well) + velle (to wish)"], ["meaning", "kind and generous"]], v: [] }, rows: [["part of speech", "adjective"], ["etymology", "from Latin for well-wishing"]], extra: "noun|from Greek for rule", trap: [0, "noun"] },
  ],
}));
