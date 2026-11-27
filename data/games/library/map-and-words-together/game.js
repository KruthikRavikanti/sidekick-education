// Map and Words Together. Skill RI.3.7-1.
// Using information gained from illustrations (maps, photographs) and the words in a text to demonstrate understanding. Ignoring the visuals is the known slip.
Sidekick.game(Sidekick.play({
  title: "Map and Words Together",
  emoji: "🦋",
  premise: "An article gives some facts in words and others in a map, photo or diagram. You need both.",
  outro: "Use the visuals and the words together to understand a text.",
  scene: "meadow",
  kind: "fill",
  cast: "",
  hint: "Which facts are in the words? Which can only be seen on the map?",
  tag: "ignores_visuals",
  rounds: [
    { say: "The text says butterflies fly south each fall. A map shows arrows from Canada to Mexico. Where does each fact come from?", rows: [["They travel in the fall.", "the words"], ["They end up in Mexico.", "the map"]], extra: "neither one|", trap: [1, "the words"], why: "The words say south, but only the map shows Mexico.", win: "Words and map together tell the whole story." },
    { say: "The text says a volcano has a vent. A diagram labels the crater, vent and magma chamber. Where does each fact come from?", rows: [["A volcano has a vent.", "the words and the diagram"], ["The magma chamber is at the bottom.", "the diagram only"]], extra: "the words only|", trap: [1, "the words only"], why: "The words never mention the chamber. The diagram shows where it is.", win: "The diagram adds what the words leave out." },
    { say: "The text says penguins huddle in winter. A photo shows hundreds packed in a circle. Match by yourself.", rows: [["They huddle in winter.", "the words"], ["Hundreds pack into a circle.", "the photo"]], extra: "neither one|a chart", trap: [1, "the words"] },
  ],
}));
