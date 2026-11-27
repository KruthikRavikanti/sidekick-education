// Claim, Evidence, Reasoning. Skill W.9-10.9-1.
// Drawing evidence from literary or informational texts to support analysis and reflection. Making unsupported claims is the known slip.
Sidekick.game(Sidekick.play({
  title: "Claim, Evidence, Reasoning",
  emoji: "🧱",
  premise: "An analysis paragraph stands on three legs: what you think, what in the text shows it, and why that proves it.",
  outro: "Support analysis with a claim, evidence from the text, and reasoning that links them.",
  scene: "desk",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "The claim is your idea. The evidence is from the text. The reasoning explains the link.",
  tag: "unsupported_claim",
  rounds: [
    { say: "Label the parts of this analysis.", rows: [["claim", "The narrator envies his brother."], ["evidence", "He counts every trophy on his brother’s shelf."], ["reasoning", "Counting them shows he measures himself against them."]], trap: [1, "The narrator envies his brother."], why: "That is the idea being argued. Evidence is a detail from the text.", win: "Idea, detail, link." },
    { say: "Label these parts.", rows: [["claim", "The article shows that the drought is worsening."], ["evidence", "It reports the reservoir at 30 percent."], ["reasoning", "A level that low means supply cannot meet demand."]], trap: [2, "It reports the reservoir at 30 percent."], why: "That is the fact from the article. Reasoning explains what the fact means.", win: "Each leg holds weight." },
    { say: "Label these by yourself.", rows: [["claim", "The storm stands for the family’s anger."], ["evidence", "Thunder breaks each time the father shouts."], ["reasoning", "Pairing them ties the weather to their feelings."]], extra: "I liked this chapter.|", trap: [1, "I liked this chapter."] },
  ],
}));
