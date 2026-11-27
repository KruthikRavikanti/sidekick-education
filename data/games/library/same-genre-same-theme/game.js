// Same Genre, Same Theme. Skill RL.5.9-1.
// Comparing and contrasting stories in the same genre on their approaches to similar themes and topics. Summarizing both stories instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "Same Genre, Same Theme",
  emoji: "🔎",
  premise: "Two mysteries can explore the same theme in different ways. Compare how each one handles it.",
  outro: "Compare how stories in the same genre approach a similar theme.",
  scene: "city",
  kind: "fill",
  cast: "",
  hint: "Not what happens in each. HOW does each treat the theme?",
  tag: "summarizes_both",
  rounds: [
    { say: "Two mysteries about trust. How does each approach it?", read: "Mystery A: The detective trusts no one and solves the case alone. / Mystery B: The detective learns to trust her partner and they solve it together.", rows: [["Mystery A says", "trust is risky"], ["Mystery B says", "trust makes you stronger"]], extra: "a crime happens|", trap: [0, "a crime happens"], why: "That is plot, and it is true of both. What does A say about trust?", win: "Same theme, opposite approaches." },
    { say: "Two adventure stories about courage. How does each approach it?", read: "Story A: The hero feels no fear and charges ahead. / Story B: The hero is terrified but acts anyway.", rows: [["Story A shows courage as", "having no fear"], ["Story B shows courage as", "acting despite fear"]], extra: "a long journey|", trap: [1, "a long journey"], why: "That is the genre. How does B define courage?", win: "Two views of courage." },
    { say: "Two fantasy tales about power. Match by yourself.", read: "Tale A: A magic ring corrupts everyone who wears it. / Tale B: A magic crown helps a kind queen protect her people.", rows: [["Tale A shows power as", "dangerous"], ["Tale B shows power as", "a tool for good"]], extra: "a kind of jewelry|magic exists", trap: [0, "a kind of jewelry"] },
  ],
}));
