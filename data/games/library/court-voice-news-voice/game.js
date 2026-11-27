// Court Voice, News Voice. Skill RI.9-10.4-1.
// Analyzing the cumulative impact of word choices on meaning and tone, such as the language of a court opinion compared with a newspaper. Naming differences without effect is the known slip.
Sidekick.game(Sidekick.play({
  title: "Court Voice, News Voice",
  emoji: "⚖️",
  premise: "A court opinion and a news story can report the same ruling in very different language. The words fit the job.",
  outro: "Legal language is formal and exact to avoid doubt. News language is plain and quick to inform.",
  scene: "city",
  kind: "sort",
  fs: 4.4,
  hint: "Is the wording built for precision or for speed?",
  tag: "names_only",
  rounds: [
    { say: "Which kind of document does each sentence sound like?", bins: "Court opinion|News article", items: ["The petitioner’s claim is hereby denied.|The statute, as written, admits no such exception.", "A judge threw out the case on Tuesday.|The ruling means the park stays open."], trap: ["A judge threw out the case on Tuesday.", 0], why: "Threw out is everyday speech, chosen so readers get it at a glance.", win: "Formal and exact, or plain and fast." },
    { say: "What does each style of wording achieve?", kind: "fill", fs: 4.6, cast: "", rows: [["hereby, pursuant to, the aforesaid", "precision that leaves no room for doubt"], ["threw out, big win, stays open", "quick understanding for a wide audience"]], extra: "makes the text longer|", trap: [0, "makes the text longer"], why: "Length is a side effect. The formal terms exist to pin the meaning down.", win: "Each style fits its purpose." },
    { say: "Sort these by yourself.", bins: "Court opinion|News article", items: ["The judgment of the lower court is affirmed.|The appellant bears the burden of proof.", "The city lost its appeal.|Lawyers say the fight is not over."], trap: ["The city lost its appeal.", 0] },
  ],
}));
