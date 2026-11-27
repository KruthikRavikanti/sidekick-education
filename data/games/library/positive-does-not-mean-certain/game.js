// Positive Does Not Mean Certain. Skill S-MD.B.7-1.
// Analyzing decisions and strategies using probability concepts, as in screening tests. Ignoring false positives is the known slip.
Sidekick.game(Sidekick.play({
  title: "Positive Does Not Mean Certain",
  emoji: "🧪",
  premise: "When a condition is rare, most positive results can come from people who do not have it. Count both kinds of positives.",
  outro: "P(has it given positive) = true positives ÷ all positives. Always include the false positives.",
  scene: "paper",
  kind: "type",
  icon: "🧪",
  hint: "Add the positives from both rows before you divide.",
  tag: "ignores_false_positives",
  rounds: [
    { say: "Out of 100 people, 10 have a condition. Key in how many test positive in all.", fig: { type: "table", rows: [["", "Positive", "Negative", "Total"], ["Has it", 10, 0, 10], ["Does not", 10, 80, 90], ["Total", 20, 80, 100]], head: true, v: [] }, ans: 20, trap: 10, why: "Ten people without the condition also tested positive. Count them too.", win: "10 true positives + 10 false positives = 20." },
    { say: "Someone tests positive. Key in the probability that they have the condition, as a fraction.", fig: { type: "table", rows: [["", "Positive", "Negative", "Total"], ["Has it", 10, 0, 10], ["Does not", 10, 80, 90], ["Total", 20, 80, 100]], head: true, v: [] }, ans: "10/20", trap: "10/10", why: "Of the 20 positives, only 10 have it.", win: "10 of 20: only a one half chance." },
    { say: "By yourself: someone tests positive. Key in the probability that they have the condition, as a fraction.", fig: { type: "table", rows: [["", "Positive", "Negative", "Total"], ["Has it", 8, 2, 10], ["Does not", 32, 158, 190], ["Total", 40, 160, 200]], head: true, v: [] }, ans: "8/40", trap: "8/10" },
  ],
}));
