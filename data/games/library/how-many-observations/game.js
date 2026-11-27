// How Many Observations?. Skill 6.SP.B.5-1.
// Reporting the number of observations in a data set. Confusing the number of observations with the total of the values is the known slip.
Sidekick.game(Sidekick.play({
  title: "How Many Observations?",
  emoji: "🔢",
  premise: "Each data value is one observation. The number of observations is how many values there are, not what they add up to.",
  outro: "The number of observations is the count of data values.",
  scene: "desk",
  kind: "type",
  icon: "🔢",
  hint: "Count the values, one for each. Do not add them.",
  tag: "total_not_count",
  rounds: [
    { say: "Key in the number of observations.", q: "Scores: 5, 7, 7, 8, 9, 10", ans: 6, trap: 46, why: "That adds the scores. Count how many scores are listed.", win: "There are 6 scores." },
    { say: "How many observations does the dot plot show?", fig: { type: "bars", stack: true, given: [["1", 2], ["2", 3], ["3", 1]], cap: 4, v: [] }, ans: 6, trap: 11, why: "That adds up the values. Each mark is one observation.", win: "2 + 3 + 1 = 6 marks." },
    { say: "Count the observations by yourself.", alt: [{ q: "Laps: 3, 3, 4, 6, 9", ans: 5, trap: 25 }, { q: "Points: 10, 20, 20, 30, 40, 40, 50", ans: 7, trap: 210 }, { q: "Hours: 8, 8, 8", ans: 3, trap: 24 }] },
  ],
}));
