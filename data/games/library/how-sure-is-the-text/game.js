// How Sure Is the Text?. Skill RI.11-12.1-1.
// Citing strong and thorough textual evidence, including where the text leaves matters uncertain. Overstating certainty is the known slip.
Sidekick.game(Sidekick.play({
  title: "How Sure Is the Text?",
  emoji: "📏",
  premise: "Careful nonfiction signals its own limits with words like may, suggests and preliminary. Do not claim more than the text does.",
  outro: "Cite evidence and note where the text itself is uncertain. Match your certainty to the author’s.",
  scene: "desk",
  kind: "sort",
  fs: 4.2,
  hint: "Look for hedging words: may, might, suggests, early, so far.",
  tag: "overstates_certainty",
  rounds: [
    { say: "What does the passage state firmly, and what does it hedge?", read: "The trial enrolled 200 patients. Early results suggest the drug may reduce symptoms, but the authors say longer studies are needed.", bins: "Stated firmly|Left uncertain", items: ["200 patients took part.|The authors want longer studies.", "whether the drug works|whether the benefit lasts"], trap: ["whether the drug works", 0], why: "Suggest and may are hedges. The text does not claim the drug works.", win: "Match the author’s caution." },
    { say: "Sort these.", read: "The bones are at least 9,000 years old. They might belong to one family, but DNA tests are not complete.", bins: "Stated firmly|Left uncertain", items: ["The bones are very old.|DNA testing is unfinished.", "whether they are one family|what the DNA will show"], trap: ["whether they are one family", 0], why: "Might belong is a guess the author flags as untested.", win: "Facts, then open questions." },
    { say: "Sort these by yourself.", read: "Sea level at the harbor rose four inches in thirty years. Models project further rise, with estimates ranging widely.", bins: "Stated firmly|Left uncertain", items: ["The harbor rose four inches.|That took thirty years.", "how much more it will rise|which model is closest"], trap: ["how much more it will rise", 0] },
  ],
}));
