// Out of Which Total?. Skill S-ID.B.5-2.
// Interpreting joint, marginal and conditional relative frequencies. Using the grand total for conditional frequencies is the known slip.
Sidekick.game(Sidekick.play({
  title: "Out of Which Total?",
  emoji: "🎯",
  premise: "The same count gives different percents depending on what you divide by: the whole table, or just one row.",
  outro: "Joint: out of the grand total. Marginal: a row or column total out of everything. Conditional: out of one row or column.",
  scene: "desk",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "“Of the boys” means divide by the number of boys, not by everyone.",
  tag: "grand_total_for_conditional",
  rounds: [
    { say: "Use the table. Match each percent.", fig: { type: "table", rows: [["", "Sports", "No sports", "Total"], ["Boys", 25, 15, 40], ["Girls", 30, 30, 60], ["Total", 55, 45, 100]], head: true, v: [] }, rows: [["of the boys, the percent in sports", "62.5%"], ["of all students, the percent who are boys in sports", "25%"]], extra: "40%", trap: [0, "25%"], why: "Of the boys means out of 40: 25 ÷ 40.", win: "Same 25 students, two different totals." },
    { say: "Name each kind of relative frequency.", rows: [["25 of 100: boys in sports", "joint"], ["55 of 100: everyone in sports", "marginal"], ["25 of 40: sports among boys", "conditional"]], trap: [2, "joint"], why: "It is out of one row only. That makes it conditional.", win: "Joint, marginal, conditional." },
    { say: "Use this table by yourself.", fig: { type: "table", rows: [["", "Pet", "No pet", "Total"], ["Adults", 18, 22, 40], ["Teens", 12, 8, 20], ["Total", 30, 30, 60]], head: true, v: [] }, rows: [["of the teens, the percent with a pet", "60%"], ["of everyone, the percent who are teens with a pet", "20%"]], extra: "30% 12%", trap: [0, "20%"] },
  ],
}));
