// Technical Words. Skill RI.4.4-1.
// Determining the meaning of general academic and domain-specific words in a text. Skipping technical words is the known slip.
Sidekick.game(Sidekick.play({
  title: "Technical Words",
  emoji: "🏞️",
  premise: "Do not skip a technical word. The text usually defines it right there, set off by commas or the word or.",
  outro: "Look for a definition next to a technical word.",
  scene: "forest",
  kind: "fill",
  cast: "",
  hint: "Read the words right after the technical term.",
  tag: "skips_technical_words",
  rounds: [
    { say: "Match each word to the meaning the text gives.", read: "Erosion, the wearing away of soil, changed the cliff. Sediment, or bits of rock and sand, piled up below.", rows: [["erosion", "the wearing away of soil"], ["sediment", "bits of rock and sand"]], extra: "a kind of cliff|", trap: [0, "a kind of cliff"], why: "Read between the commas after erosion.", win: "Erosion and sediment." },
    { say: "Match each word to the meaning the text gives.", read: "A drought, a long period with no rain, dried the fields. Farmers had to irrigate, or bring water to, their crops.", rows: [["drought", "a long time with no rain"], ["irrigate", "bring water to crops"]], extra: "pick the crops|", trap: [1, "pick the crops"], why: "Read after the word or: bring water to.", win: "Drought and irrigate." },
    { say: "Match these by yourself.", read: "Herbivores, animals that eat only plants, graze the plains. Carnivores, meat eaters, hunt them.", rows: [["herbivores", "animals that eat only plants"], ["carnivores", "meat eaters"]], extra: "plants that eat bugs|grass on the plains", trap: [0, "plants that eat bugs"] },
  ],
}));
