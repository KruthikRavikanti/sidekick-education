// Fair Summary of a Hard Text. Skill RI.11-12.2-2.
// Providing an objective summary of an informational text. Adding opinions is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fair Summary of a Hard Text",
  emoji: "📋",
  premise: "Summarizing a complex argument means keeping every main idea in proportion and leaving your own position at the door.",
  outro: "Provide an objective summary that covers each central idea and omits opinion.",
  scene: "desk",
  kind: "sort",
  fs: 4.2,
  hint: "Is this one of the text’s ideas, or the summarizer’s reaction?",
  tag: "includes_opinions",
  rounds: [
    { say: "Which sentences belong in an objective summary?", read: "The essay argues that standardized tests measure preparation more than ability, and that wealth buys preparation.", bins: "Keep|Leave out", items: ["Tests reflect preparation.|Wealth buys preparation.", "The author is so right.|Tests are a scam."], trap: ["Tests are a scam.", 0], why: "Scam is your word, not the essay’s. Report its claim in neutral terms.", win: "Their ideas, your neutral words." },
    { say: "Sort these.", read: "The report finds remote work raised output for writers but lowered it for new hires, who learn by watching others.", bins: "Keep|Leave out", items: ["Output rose for writers.|New hires did worse.", "Remote work is clearly the future.|Managers just hate change."], trap: ["Remote work is clearly the future.", 0], why: "The report gives a mixed result. Clearly the future is a prediction of yours.", win: "Keep the mixed finding mixed." },
    { say: "Sort these by yourself.", read: "Wolves reduced elk herds in the park, which let willows recover, though scientists debate how large the effect is.", bins: "Keep|Leave out", items: ["Wolves reduced elk numbers.|Scientists debate the effect’s size.", "Wolves are heroes.|The doubters are just jealous."], trap: ["Wolves are heroes.", 0] },
  ],
}));
