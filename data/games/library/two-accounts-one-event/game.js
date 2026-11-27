// Two Accounts, One Event. Skill RI.5.6-1.
// Analyzing multiple accounts of the same event, noting similarities and differences in point of view. Treating the accounts as identical is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Accounts, One Event",
  emoji: "📰",
  premise: "Two people can describe the same event very differently. Notice what they agree on and where their views split.",
  outro: "Compare accounts of one event: what is the same, and how do the points of view differ?",
  scene: "paper",
  kind: "sort",
  hint: "Do both say it, or only one?",
  tag: "treats_accounts_as_identical",
  rounds: [
    { say: "Two accounts of a town meeting. Sort the details.", read: "A shop owner: \"The new road will bring customers. Everyone cheered.\" / A farmer: \"The new road will cut through my field. Many of us were upset.\"", bins: "Both|Only the shop owner|Only the farmer", items: ["a new road is planned|", "it will bring customers|", "it will cut through a field|"], trap: ["a new road is planned", 1], why: "Both of them mention the new road.", win: "Same event, different points of view." },
    { say: "Two accounts of a soccer final. Sort the details.", read: "Winning coach: \"We played our best game ever.\" / Losing coach: \"The referee missed two fouls.\"", bins: "Both|Only the winner|Only the loser", items: ["a final was played|", "the team played its best|", "the referee missed fouls|"], trap: ["the referee missed fouls", 1], why: "Only the losing coach says that.", win: "The view depends on who is telling it." },
    { say: "Two accounts of a snowstorm. Sort by yourself.", read: "A student: \"No school for three days!\" / A nurse: \"I could not get home from the hospital.\"", bins: "Both|Only the student|Only the nurse", items: ["a big storm hit|", "school was closed|", "could not get home|"], trap: ["a big storm hit", 1] },
  ],
}));
