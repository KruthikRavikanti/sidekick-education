// The Exact Word. Skill W.6.2-3.
// Using precise language and domain-specific vocabulary to explain a topic. Vague wording is the known slip.
Sidekick.game(Sidekick.play({
  title: "The Exact Word",
  emoji: "🎯",
  premise: "Experts use exact terms. Swap a vague phrase for the precise word and your writing sounds like you know the subject.",
  outro: "Precise language and subject vocabulary make informative writing clear.",
  scene: "desk",
  kind: "fill",
  fs: 4.8,
  cast: "",
  hint: "What is the one science word for this whole phrase?",
  tag: "vague_wording",
  rounds: [
    { say: "Replace each vague phrase with the precise term.", rows: [["the hot liquid rock under the ground", "magma"], ["the shaking of the ground", "earthquake"]], extra: "stuff|", trap: [0, "stuff"], why: "Stuff is even vaguer. Use the science word.", win: "Magma and earthquake." },
    { say: "Replace each vague phrase.", rows: [["the tiny living things that cause illness", "germs"], ["the gas we breathe out", "carbon dioxide"], ["animals that eat only plants", "herbivores"]], trap: [2, "germs"], why: "Plant eaters have their own name: herbivores.", win: "Three precise terms." },
    { say: "Replace these by yourself.", rows: [["the place where a river begins", "source"], ["water falling from clouds", "precipitation"], ["the path a planet travels", "orbit"]], extra: "thing|", trap: [2, "thing"] },
  ],
}));
