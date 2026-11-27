// Two-Way Table Totals. Skill 8.SP.A.4-1.
// Constructing a two-way table summarizing data on two categorical variables. Putting totals in the opposite place is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two-Way Table Totals",
  emoji: "🧮",
  premise: "A two-way table sorts people by two questions at once. Row totals go at the end of rows. Column totals go under columns.",
  outro: "Add across for a row total and down for a column total. All totals meet at the grand total.",
  scene: "desk",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "A row total adds across. A column total adds down.",
  tag: "totals_in_other_place",
  rounds: [
    { say: "Find the missing totals.", fig: { type: "table", rows: [["", "Job", "No job", "Total"], ["Sports", 12, 8, "?"], ["No sports", 4, 6, "?"], ["Total", "?", "?", 30]], head: true, v: [] }, rows: [["Sports total", "20"], ["No sports total", "10"], ["Job total", "16"]], extra: "14", trap: [2, "20"], why: "20 adds across the Sports row. The Job total adds down: 12 + 4.", win: "20 and 10 across, 16 down." },
    { say: "Find the missing totals.", fig: { type: "table", rows: [["", "Cat", "No cat", "Total"], ["Dog", 5, 7, "?"], ["No dog", 3, 5, "?"], ["Total", "?", "?", 20]], head: true, v: [] }, rows: [["Dog total", "12"], ["Cat total", "8"]], extra: "10 7", trap: [1, "12"], why: "12 is the Dog row. The Cat total adds down the Cat column: 5 + 3.", win: "Dog 12 across, Cat 8 down." },
    { say: "Find the totals by yourself.", fig: { type: "table", rows: [["", "Bus", "No bus", "Total"], ["Grade 7", 9, 6, "?"], ["Grade 8", 11, 4, "?"], ["Total", "?", "?", 30]], head: true, v: [] }, rows: [["Grade 7 total", "15"], ["Bus total", "20"], ["No bus total", "10"]], extra: "17 13", trap: [1, "15"] },
  ],
}));
