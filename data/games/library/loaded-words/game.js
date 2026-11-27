// Loaded Words. Skill RI.7.4-1.
// Analyzing the impact of a specific word choice on meaning and tone. Naming the words without their effect is the known slip.
Sidekick.game(Sidekick.play({
  title: "Loaded Words",
  emoji: "🎚️",
  premise: "Calling a plan bold or reckless describes the same plan with opposite attitudes. One word can set the tone.",
  outro: "Analyze how a specific word choice shapes meaning and tone.",
  scene: "city",
  kind: "sort",
  fs: 5.2,
  hint: "Does the word make the subject sound good or bad?",
  tag: "words_without_effect",
  rounds: [
    { say: "An author describes a new plan. Is each word approving or critical?", bins: "Approving|Critical", items: ["bold|ambitious|visionary", "reckless|risky|far-fetched"], trap: ["reckless", 0], why: "Reckless suggests careless danger. The author disapproves.", win: "Same plan, opposite tones." },
    { say: "What tone does each word choice create?", kind: "fill", fs: 4.8, cast: "", rows: [["The council SLASHED the budget.", "harsh and critical"], ["The council TRIMMED the budget.", "mild and careful"]], extra: "joyful and proud|", trap: [0, "mild and careful"], why: "Slashed sounds violent. It makes the cut seem severe.", win: "Slashed alarms. Trimmed reassures." },
    { say: "An author describes a crowd. Sort by yourself.", bins: "Approving|Critical", items: ["spirited|lively|passionate", "rowdy|unruly|out of control"], trap: ["rowdy", 0] },
  ],
}));
