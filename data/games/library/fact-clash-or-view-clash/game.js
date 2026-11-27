// Fact Clash or View Clash?. Skill RI.8.9-1.
// Analyzing texts that provide conflicting information and identifying where they disagree on fact or interpretation. Picking a side without analysis is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fact Clash or View Clash?",
  emoji: "⚡",
  premise: "When two texts disagree, ask how. They may report different facts, or read the same facts differently.",
  outro: "Identify whether texts disagree on matters of fact or on interpretation.",
  scene: "city",
  kind: "sort",
  fs: 4.4,
  hint: "Could a measurement settle it? Then it is a fact dispute.",
  tag: "picks_side_without_analysis",
  rounds: [
    { say: "Two articles discuss a new dam. How does each pair disagree?", bins: "On facts|On interpretation", items: ["A: it cost $2 billion. B: it cost $3 billion.|A: 500 homes were moved. B: 2,000 were.", "A: the cost was worth it. B: it was wasteful.|A: progress. B: a tragedy."], trap: ["A: the cost was worth it. B: it was wasteful.", 0], why: "Worth it is a judgment. No measurement can settle it.", win: "Numbers can be checked. Judgments cannot." },
    { say: "Two articles discuss screen time. Sort the disagreements.", bins: "On facts|On interpretation", items: ["A: teens average 4 hours a day. B: 7 hours.|A: use rose last year. B: it fell.", "A: this is harmless. B: this is alarming.|A: a healthy habit. B: a worrying trend."], trap: ["A: use rose last year. B: it fell.", 1], why: "Whether use rose or fell can be measured. That is a fact dispute.", win: "Check the facts. Weigh the views." },
    { say: "Two articles discuss a mayor’s first year. Sort by yourself.", bins: "On facts|On interpretation", items: ["A: crime fell 10 percent. B: it rose 5 percent.|A: 3 parks opened. B: only 1 did.", "A: a strong start. B: a disappointment.|A: bold leadership. B: reckless spending."], trap: ["A: a strong start. B: a disappointment.", 0] },
  ],
}));
