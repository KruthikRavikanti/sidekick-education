// How Ideas Get Linked. Skill RI.8.3-1.
// Analyzing how a text makes connections among and distinctions between individuals, ideas or events through comparisons, analogies or categories. Describing each one alone is the known slip.
Sidekick.game(Sidekick.play({
  title: "How Ideas Get Linked",
  emoji: "🪢",
  premise: "Authors connect ideas by comparing them, by drawing an analogy to something familiar, or by sorting them into categories.",
  outro: "Name the method: comparison, analogy or category.",
  scene: "desk",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "Is it showing a likeness, explaining with something familiar, or sorting into groups?",
  tag: "describes_each_alone",
  rounds: [
    { say: "Which method links the ideas?", rows: [["The heart works like a pump in a water system.", "analogy"], ["Unlike frogs, toads have dry, bumpy skin.", "comparison"]], extra: "category|", trap: [0, "category"], why: "It explains the heart by something familiar. That is an analogy.", win: "An analogy, then a comparison." },
    { say: "Which method links the ideas?", rows: [["Rocks fall into three types: igneous, sedimentary and metamorphic.", "category"], ["Both leaders rose from poverty, but only one kept power.", "comparison"]], extra: "analogy|", trap: [0, "analogy"], why: "Sorting into three types is grouping by category.", win: "A category, then a comparison." },
    { say: "Match these by yourself.", rows: [["Memory is like a library that files new books each night.", "analogy"], ["Energy sources are either renewable or nonrenewable.", "category"]], extra: "comparison|story", trap: [1, "comparison"] },
  ],
}));
