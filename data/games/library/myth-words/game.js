// Myth Words. Skill RL.4.4-1.
// Determining the meaning of words and phrases, including those that allude to characters in mythology. Not seeing the allusion is the known slip.
Sidekick.game(Sidekick.play({
  title: "Myth Words",
  emoji: "🏛️",
  premise: "Some words come from old myths. Hercules was famously strong, so a Herculean task is one that takes great strength.",
  outro: "Words that allude to myths carry the meaning of the character they come from.",
  scene: "sand",
  kind: "fill",
  cast: "",
  hint: "What was that mythical character known for?",
  tag: "does_not_see_allusion",
  rounds: [
    { say: "Use what each myth figure is known for.", rows: [["Hercules was very strong. A Herculean task is", "extremely hard"], ["Midas turned things to gold. The Midas touch means", "a gift for making money"]], extra: "about a hero|", trap: [0, "about a hero"], why: "It is not about a hero. It borrows his strength to mean very hard.", win: "The myth gives the word its meaning." },
    { say: "Use what each myth figure is known for.", rows: [["Achilles had one weak spot. An Achilles heel is", "a point of weakness"], ["Odysseus traveled for years. An odyssey is", "a long journey"]], extra: "a kind of shoe|", trap: [0, "a kind of shoe"], why: "It is not about feet. It means a weak point.", win: "Two more words from myths." },
    { say: "Work these out by yourself.", rows: [["Pandora opened a box of troubles. To open Pandora’s box is to", "start many problems"], ["Atlas held up the sky. An atlas is a book that", "holds maps of the world"]], extra: "find a present|carry heavy bags", trap: [0, "find a present"] },
  ],
}));
