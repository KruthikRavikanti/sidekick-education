// Many Sources, One Answer. Skill RI.11-12.7-1.
// Integrating and evaluating multiple sources of information presented in different media or formats. Using one source is the known slip.
Sidekick.game(Sidekick.play({
  title: "Many Sources, One Answer",
  emoji: "🧩",
  premise: "A hard question needs more than one kind of source. Numbers, voices and images each show part of the picture.",
  outro: "Integrate and evaluate sources in different media and formats to address a question.",
  scene: "desk",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "What can this format show well? What can it not show?",
  tag: "uses_one_source",
  rounds: [
    { say: "Question: did the new bus line help the neighborhood? Match each source to what it offers.", rows: [["ridership table", "how many people use it"], ["resident interviews", "how daily life changed"], ["route map", "which streets are served"]], extra: "everything at once|", trap: [0, "everything at once"], why: "No single source gives everything. A table gives the counts.", win: "Numbers, voices, places." },
    { say: "Now evaluate each source. Match it to its limit.", rows: [["ridership table", "cannot say why people ride"], ["one interview", "may not speak for everyone"], ["a campaign ad", "has a reason to exaggerate"]], trap: [2, "cannot say why people ride"], why: "An ad’s limit is bias. It is made to persuade.", win: "Every source has a limit." },
    { say: "Question: is the lake getting cleaner? Match by yourself.", rows: [["water test data", "measured pollution levels"], ["satellite photos", "the spread of algae over years"], ["a fisher’s account", "what the catch has been like"]], extra: "a full answer alone|", trap: [1, "a full answer alone"] },
  ],
}));
