// Fill the Two-Way Table. Skill S-ID.B.5-1.
// Summarizing categorical data for two categories in two-way frequency tables. Mixing up row and column totals is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fill the Two-Way Table",
  emoji: "🗃️",
  premise: "A two-way table sorts people by two categories. Row totals go across. Column totals go down. They must agree at the corner.",
  outro: "Use the totals to fill the missing cells: each row and column must add up.",
  scene: "desk",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "A row adds across to its total. A column adds down.",
  tag: "mixes_row_and_column_totals",
  rounds: [
    { say: "Find the missing numbers.", fig: { type: "table", rows: [["", "Sports", "No sports", "Total"], ["Boys", 25, "?", 40], ["Girls", 30, "?", 60], ["Total", "?", "?", 100]], head: true, v: [] }, rows: [["boys, no sports", "15"], ["girls, no sports", "30"], ["sports total", "55"]], extra: "45 40", trap: [2, "40"], why: "40 is the total for the Boys row. The Sports column adds down: 25 + 30.", win: "15, 30 and 55." },
    { say: "Find the missing totals.", fig: { type: "table", rows: [["", "Bus", "Walk", "Total"], ["Grade 9", 30, 20, "?"], ["Grade 10", 25, 25, "?"], ["Total", "?", "?", 100]], head: true, v: [] }, rows: [["Grade 9 total", "50"], ["Bus total", "55"], ["Walk total", "45"]], extra: "100", trap: [1, "50"], why: "50 adds across Grade 9. The Bus total adds down: 30 + 25.", win: "50 across, 55 and 45 down." },
    { say: "Find the missing numbers by yourself.", fig: { type: "table", rows: [["", "Pet", "No pet", "Total"], ["Adults", 18, "?", 40], ["Teens", 12, "?", 20], ["Total", "?", "?", 60]], head: true, v: [] }, rows: [["adults, no pet", "22"], ["teens, no pet", "8"], ["pet total", "30"]], extra: "40 58", trap: [2, "40"] },
  ],
}));
