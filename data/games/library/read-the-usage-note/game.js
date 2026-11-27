// Read the Usage Note. Skill L.11-12.4-3.
// Consulting general and specialized reference materials to determine a word’s precise meaning, part of speech, etymology or standard usage. Choosing an unfitting meaning is the known slip.
Sidekick.game(Sidekick.play({
  title: "Read the Usage Note",
  emoji: "🗂️",
  premise: "Good dictionaries add usage notes that explain how a word is properly used. They settle arguments a definition cannot.",
  outro: "Consult references for a word’s meaning, part of speech, etymology and standard usage.",
  scene: "desk",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "Find the row of the entry that answers the question.",
  tag: "picks_unfitting_meaning",
  rounds: [
    { say: "Use the entry for comprise.", fig: { type: "table", rows: [["word", "comprise"], ["part of speech", "verb"], ["meaning", "to consist of; to include"], ["usage", "the whole comprises the parts"]], v: [] }, rows: [["The team ___ nine players.", "comprises"], ["part of speech", "verb"]], extra: "is comprised by|noun", trap: [0, "is comprised by"], why: "The usage note says the whole comprises its parts, in the active form.", win: "The whole comprises the parts." },
    { say: "Use the entry for literally.", fig: { type: "table", rows: [["word", "literally"], ["part of speech", "adverb"], ["meaning", "in the exact sense of the words"], ["usage", "avoid it for mere emphasis in formal writing"]], v: [] }, rows: [["formal use", "The bridge literally collapsed."], ["avoid in formal use", "I literally died laughing."]], extra: "It is an adjective.|", trap: [0, "I literally died laughing."], why: "Nobody died. The note says to avoid that use in formal writing.", win: "Exact sense only." },
    { say: "Use the entry by yourself.", fig: { type: "table", rows: [["word", "peruse"], ["part of speech", "verb"], ["origin", "Latin per (thoroughly) + use"], ["meaning", "to read carefully"]], v: [] }, rows: [["meaning", "to read carefully"], ["etymology", "from Latin for use thoroughly"]], extra: "to skim quickly|from Greek for letter", trap: [0, "to skim quickly"] },
  ],
}));
