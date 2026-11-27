// Structure Showdown. Skill RL.8.5-1.
// Comparing the structure of two or more texts and analyzing how each structure contributes to meaning and style. Describing the structure only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Structure Showdown",
  emoji: "🏗️",
  premise: "Two stories can cover similar ground with different structures. A diary feels close and immediate. A flashback creates mystery.",
  outro: "Compare how each text’s structure contributes to its meaning and style.",
  scene: "paper",
  kind: "sort",
  fs: 4.4,
  hint: "What does that structure let the reader feel or know?",
  tag: "describes_structure_only",
  rounds: [
    { say: "Text A is a diary. Text B starts at the end and flashes back. Match each effect.", bins: "Diary|Flashback|Both", items: ["feels private and day by day|", "makes you wonder how it came to this|", "tells one person’s story|"], trap: ["makes you wonder how it came to this", 0], why: "Knowing the ending first is what creates that question.", win: "Structure shapes the experience." },
    { say: "Text A is a poem in stanzas. Text B is a story in chapters. Match each effect.", bins: "Poem|Story|Both", items: ["each stanza holds one image|", "chapters build events over time|", "the order of parts is chosen on purpose|"], trap: ["the order of parts is chosen on purpose", 1], why: "Poets order stanzas as carefully as novelists order chapters.", win: "Different units, same care." },
    { say: "Text A is told in letters. Text B has two narrators taking turns. Sort by yourself.", bins: "Letters|Two narrators|Both", items: ["we hear only what one writer chooses to say|", "we see the same event from two sides|", "the reader pieces the truth together|"], trap: ["the reader pieces the truth together", 0] },
  ],
}));
