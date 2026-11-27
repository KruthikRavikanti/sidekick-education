// Prove Your Reading. Skill W.11-12.9-1.
// Drawing evidence from literary or informational texts to support analysis, reflection and research. Making unsupported claims is the known slip.
Sidekick.game(Sidekick.play({
  title: "Prove Your Reading",
  emoji: "🧾",
  premise: "Analysis is a claim about a text that the text itself can back up. Without evidence and reasoning it is only an impression.",
  outro: "Draw evidence from literary or informational texts to support analysis, with reasoning that connects it to the claim.",
  scene: "desk",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "Claim: your idea. Evidence: from the text. Reasoning: why the evidence proves the idea.",
  tag: "unsupported_claim",
  rounds: [
    { say: "Label the parts of this analysis.", rows: [["claim", "The speech casts the war as a moral test."], ["evidence", "It names both sides as praying to the same God."], ["reasoning", "Shared prayer makes the conflict a judgment on all."]], trap: [0, "It names both sides as praying to the same God."], why: "That is a detail from the speech. The claim is the idea it supports.", win: "Idea, detail, link." },
    { say: "Label these parts.", rows: [["claim", "The narrator cannot be trusted."], ["evidence", "He tells the same event two different ways."], ["reasoning", "A teller who contradicts himself hides something."]], trap: [2, "He tells the same event two different ways."], why: "That is what the text shows. Reasoning explains why it matters.", win: "Show it, then explain it." },
    { say: "Label these by yourself.", rows: [["claim", "The essay treats boredom as useful."], ["evidence", "It credits idle afternoons with the writer’s first story."], ["reasoning", "Linking idleness to creation recasts boredom as fertile."]], extra: "I found the essay dull.|", trap: [1, "I found the essay dull."] },
  ],
}));
