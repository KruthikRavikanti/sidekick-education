// Know Your Sources’ Limits. Skill W.11-12.8-1.
// Assessing the strengths and limitations of each source in terms of the task, purpose and audience, avoiding plagiarism and overreliance on any one source. Plagiarizing or leaning on one source is the known slip.
Sidekick.game(Sidekick.play({
  title: "Know Your Sources’ Limits",
  emoji: "🧪",
  premise: "Every source is good for some things and weak for others. Use each for its strength, and never lean on only one.",
  outro: "Assess the strengths and limitations of each source for the task, integrate information selectively, and cite it.",
  scene: "desk",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "What is this source best at? Where might it mislead?",
  tag: "overrelies_on_one_source",
  rounds: [
    { say: "Match each source to its main strength.", rows: [["peer-reviewed study", "methods checked by other experts"], ["government data", "large, consistent records"], ["eyewitness blog", "vivid detail from the scene"]], extra: "has no limits|", trap: [0, "has no limits"], why: "Every source has limits. A reviewed study is strong because experts checked its methods.", win: "Each source has a best use." },
    { say: "Now match each source to its main limitation.", rows: [["reviewed study", "may cover only a small sample"], ["press release", "written to flatter the company"], ["eyewitness blog", "one person’s view, unverified"]], trap: [1, "may cover only a small sample"], why: "A press release’s limit is its purpose: promotion.", win: "Know where each one is weak." },
    { say: "Good practice, or a problem?", kind: "sort", fs: 4.2, bins: "Good practice|Problem", items: ["citing three sources that confirm each other|quoting exactly and naming the author", "building the whole paper on one website|rewording a source and leaving out the citation"], trap: ["building the whole paper on one website", 0] },
  ],
}));
