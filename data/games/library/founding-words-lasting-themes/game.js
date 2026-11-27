// Founding Words, Lasting Themes. Skill RI.9-10.9-1.
// Analyzing seminal US documents of historical and literary significance, including how they address related themes. Summarizing only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Founding Words, Lasting Themes",
  emoji: "📜",
  premise: "A few documents shaped how the United States talks about itself. Each one argues for an idea that later writers return to.",
  outro: "Analyze foundational US documents by the themes and concepts they address: equality, consent, union, liberty.",
  scene: "paper",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "What big idea is the document arguing for?",
  tag: "summarizes_only",
  rounds: [
    { say: "Match each document to a theme it addresses.", fs: 4.4, rows: [["Declaration, 1776", "people have rights governments must respect"], ["Gettysburg Address", "a nation built on equality must endure"], ["Bill of Rights", "named freedoms are protected"]], extra: "kings rule by birth|", trap: [0, "kings rule by birth"], why: "The Declaration argues the opposite: power comes from the consent of the governed.", win: "Rights, equality, protected freedoms." },
    { say: "Lincoln’s phrase \"government of the people, by the people, for the people\" is from the Gettysburg Address. What does each part stress?", rows: [["of the people", "power comes from citizens"], ["by the people", "citizens do the governing"], ["for the people", "government exists to serve citizens"]], trap: [2, "citizens do the governing"], why: "For points to who benefits. By points to who does the work.", win: "Source, action, purpose." },
    { say: "Match each document to its theme by yourself.", fs: 4.4, rows: [["Preamble to the Constitution", "the people form a union"], ["Washington’s Farewell Address", "unity over faction"], ["Declaration of Independence", "all are created equal"]], extra: "states may ignore laws|", trap: [1, "states may ignore laws"] },
  ],
}));
