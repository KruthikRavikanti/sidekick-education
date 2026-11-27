// Admit and Answer. Skill RI.8.6-1.
// Analyzing how the author acknowledges and responds to conflicting evidence or viewpoints. Missing the counterarguments is the known slip.
Sidekick.game(Sidekick.play({
  title: "Admit and Answer",
  emoji: "↩️",
  premise: "Careful authors admit evidence against their view, then explain why their position still holds.",
  outro: "Find where the author acknowledges conflicting evidence and where the author responds to it.",
  scene: "city",
  kind: "sort",
  fs: 4.4,
  hint: "Words like admittedly and some studies admit. Words like however and yet respond.",
  tag: "misses_counterarguments",
  rounds: [
    { say: "The author supports later school starts. Sort each sentence.", bins: "Acknowledges|Responds", items: ["Admittedly, one district saw no change in grades.|It is true that buses cost more.", "However, that district moved the bell by only ten minutes.|Yet the added cost was offset by fewer absences."], trap: ["It is true that buses cost more.", 1], why: "It is true that concedes a point to the other side.", win: "Concede, then counter." },
    { say: "The author supports wind power. Sort each sentence.", bins: "Acknowledges|Responds", items: ["Critics rightly note that turbines can harm birds.|Some days the wind does not blow.", "Still, new blade designs have cut bird deaths.|Even so, batteries now store power for calm days."], trap: ["Some days the wind does not blow.", 1], why: "That admits a weakness. The response comes after.", win: "Honest about the problem, then an answer." },
    { say: "The author supports homework limits. Sort by yourself.", bins: "Acknowledges|Responds", items: ["Granted, practice does help in math.|Some students do enjoy long projects.", "But the benefit fades after an hour a night.|Nevertheless, most report stress over workload."], trap: ["Granted, practice does help in math.", 1] },
  ],
}));
