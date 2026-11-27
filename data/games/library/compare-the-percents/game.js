// Compare the Percents. Skill 8.SP.A.4-2.
// Using relative frequencies to describe possible association between two variables. Comparing counts instead of relative frequencies is the known slip.
Sidekick.game(Sidekick.play({
  title: "Compare the Percents",
  emoji: "📊",
  premise: "To see whether two things are linked, compare percents, not counts. A bigger group can have more people and still a smaller share.",
  outro: "Use relative frequencies (percents of each group) to look for an association.",
  scene: "city",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "What fraction of each group is it? Turn each into a percent.",
  tag: "compares_counts",
  rounds: [
    { say: "Find each percent, then compare.", rows: [["sports: 12 of 20 have a job", "60%"], ["no sports: 4 of 10 have a job", "40%"], ["more likely to have a job", "sports group"]], extra: "no difference|12%", trap: [0, "12%"], why: "12 out of 20 is the same share as 60 out of 100.", win: "60% compared with 40%: there is a link." },
    { say: "Find each percent, then compare.", rows: [["Club A: 12 of 60 walk", "20%"], ["Club B: 8 of 10 walk", "80%"], ["more likely to walk", "Club B"]], extra: "Club A|12%", trap: [2, "Club A"], why: "12 is more students, but out of 60. Compare 20% with 80%.", win: "Club B has the bigger share." },
    { say: "Compare these by yourself.", rows: [["Grade 7: 15 of 50 bike", "30%"], ["Grade 8: 10 of 20 bike", "50%"], ["more likely to bike", "Grade 8"]], extra: "Grade 7|15%", trap: [2, "Grade 7"] },
  ],
}));
