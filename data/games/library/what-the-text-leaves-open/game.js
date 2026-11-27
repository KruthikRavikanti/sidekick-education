// What the Text Leaves Open. Skill RL.11-12.1-1.
// Citing strong and thorough textual evidence, including determining where the text leaves matters uncertain. Ignoring ambiguity is the known slip.
Sidekick.game(Sidekick.play({
  title: "What the Text Leaves Open",
  emoji: "🌫️",
  premise: "Strong readers cite what a text proves and also admit what it never settles. Ambiguity is part of the meaning.",
  outro: "Cite strong evidence, and name where the text leaves matters uncertain.",
  scene: "night",
  kind: "sort",
  fs: 4.2,
  hint: "Does the passage say it outright, or only hint and leave room for doubt?",
  tag: "ignores_ambiguity",
  rounds: [
    { say: "What does the passage settle, and what does it leave open?", read: "Eliza burned the letter unread. She told her sister it held nothing of value. Then she stood a long time at the cold grate.", bins: "The text settles it|The text leaves it open", items: ["Eliza destroyed the letter.|She did not read it.", "what the letter said|whether she regrets burning it"], trap: ["whether she regrets burning it", 0], why: "Standing at the grate hints at regret, but the text never says so. It stays uncertain.", win: "Facts on one side, open questions on the other." },
    { say: "Sort these.", read: "The captain logged calm seas that night. By morning one lifeboat was gone, and so was the first mate. No one had heard a sound.", bins: "The text settles it|The text leaves it open", items: ["A lifeboat is missing.|The first mate is missing.", "whether he left by choice|whether the log is honest"], trap: ["whether he left by choice", 0], why: "The text gives no reason for his leaving. A careful reader says so.", win: "Name what the text will not tell you." },
    { say: "Sort these by yourself.", read: "Mr. Vale smiled as he signed the will. His nephew held the pen steady for him. The doctor looked away.", bins: "The text settles it|The text leaves it open", items: ["Mr. Vale signed the will.|The nephew helped him sign.", "whether the nephew pressured him|why the doctor looked away"], trap: ["why the doctor looked away", 0] },
  ],
}));
