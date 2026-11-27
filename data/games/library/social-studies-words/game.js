// Social Studies Words. Skill RI.5.4-1.
// Determining the meaning of general academic and domain-specific words. Using everyday meanings is the known slip.
Sidekick.game(Sidekick.play({
  title: "Social Studies Words",
  emoji: "🏛️",
  premise: "Subject words in history and science have exact meanings. The text usually gives the meaning right beside the word.",
  outro: "Use the definition in the text to learn the precise meaning of a subject word.",
  scene: "city",
  kind: "fill",
  cast: "",
  hint: "Read the phrase set off by commas right after the word.",
  tag: "uses_everyday_meaning",
  rounds: [
    { say: "Match each word to the meaning the text gives.", read: "The legislature, the group that makes laws, met today. They debated a bill, a proposed law.", rows: [["legislature", "the group that makes laws"], ["bill", "a proposed law"]], extra: "money you owe|", trap: [1, "money you owe"], why: "In everyday talk a bill is that. Here the text says a proposed law.", win: "Legislature and bill." },
    { say: "Match each word to the meaning the text gives.", read: "A colony, a settlement ruled by a distant country, grew on the coast. Settlers paid a tariff, a tax on imported goods.", rows: [["colony", "a settlement ruled from far away"], ["tariff", "a tax on imported goods"]], extra: "a group of ants|", trap: [0, "a group of ants"], why: "In science, yes. In this history text it is a settlement.", win: "Colony and tariff." },
    { say: "Match these by yourself.", read: "Cells are the tiny units that make up living things. Tissue is a group of cells working together.", rows: [["cells", "tiny units of living things"], ["tissue", "cells working together"]], extra: "rooms in a jail|soft paper", trap: [1, "soft paper"] },
  ],
}));
