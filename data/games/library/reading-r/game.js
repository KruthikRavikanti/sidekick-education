// Reading r. Skill S-ID.C.8-1.
// Computing and interpreting the correlation coefficient of a linear fit. Thinking r near 0 means no relationship of any kind is the known slip.
Sidekick.game(Sidekick.play({
  title: "Reading r",
  emoji: "📏",
  premise: "The correlation coefficient r runs from −1 to 1. Its size tells how tightly points follow a line. Its sign tells the direction.",
  outro: "r near 1 or −1: strong linear relationship. r near 0: little LINEAR relationship.",
  scene: "paper",
  kind: "sort",
  fs: 6,
  hint: "How close is r to 1 or −1? Is it positive or negative?",
  tag: "zero_r_means_nothing",
  rounds: [
    { say: "Describe each relationship.", bins: "Strong positive|Weak|Strong negative", items: ["r = 0.92|r = 0.85", "r = 0.05|r = −0.1", "r = −0.9|r = −0.95"], trap: ["r = −0.9", 1], why: "−0.9 is close to −1. That is a strong downhill trend.", win: "Size shows strength. Sign shows direction." },
    { say: "True or not true?", fs: 4.8, bins: "True|Not true", items: ["r = 0.92 means a strong upward line|r near 0 means little linear trend", "r near 0 rules out any pattern at all|r = −0.9 is weaker than r = 0.5"], trap: ["r near 0 rules out any pattern at all", 0], why: "A perfect U-shaped curve can have r near 0. r only measures straight-line trends.", win: "r is about lines only." },
    { say: "Sort these by yourself.", bins: "Strong positive|Weak|Strong negative", items: ["r = 0.97|r = 0.88", "r = 0.12|r = −0.03", "r = −0.91|r = −0.86"], trap: ["r = −0.86", 1] },
  ],
}));
