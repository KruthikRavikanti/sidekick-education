// Only the Facts That Matter Most. Skill W.11-12.2-2.
// Developing the topic thoroughly by selecting the most significant and relevant facts. Thin or unselective development is the known slip.
Sidekick.game(Sidekick.play({
  title: "Only the Facts That Matter Most",
  emoji: "⚗️",
  premise: "Research leaves you with more facts than you can use. Choosing the most significant ones is the real skill.",
  outro: "Develop a topic by selecting the most significant and relevant facts, definitions, details and examples.",
  scene: "desk",
  kind: "sort",
  fs: 4.2,
  hint: "Would the explanation be weaker without this fact?",
  tag: "thin_development",
  rounds: [
    { say: "Topic: why the Roman Empire declined. Which facts carry the most weight?", bins: "Most significant|Minor or off topic", items: ["The army grew too costly to pay.|Rival generals fought repeated civil wars.", "Romans enjoyed public baths.|Togas were usually white."], trap: ["Romans enjoyed public baths.", 0], why: "True, but baths do not explain a decline. Cost and civil war do.", win: "Choose what explains." },
    { say: "Topic: how a recession spreads. Sort the facts.", bins: "Most significant|Minor or off topic", items: ["Laid-off workers spend less.|Falling sales lead to more layoffs.", "Economists often wear suits.|The word comes from Latin."], trap: ["The word comes from Latin.", 0], why: "Word origins do not explain how the downturn spreads.", win: "Significant and relevant." },
    { say: "Topic: why coral reefs are dying. Sort these by yourself.", bins: "Most significant|Minor or off topic", items: ["Warmer water makes corals expel their algae.|More acidic seas weaken coral skeletons.", "Reefs are popular with tourists.|Coral comes in many colors."], trap: ["Reefs are popular with tourists.", 0] },
  ],
}));
