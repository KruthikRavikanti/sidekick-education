// Untangle the Long Sentence. Skill RL.11-12.10-1.
// Reading and comprehending literature at the high end of the grades 11 to college-ready band. Needing support with complex syntax is the known slip.
Sidekick.game(Sidekick.play({
  title: "Untangle the Long Sentence",
  emoji: "🧶",
  premise: "Older and more complex prose packs a paragraph into one sentence. Find its spine, then hang the rest on it.",
  outro: "For dense prose: find the main clause, then sort out the phrases that modify it.",
  scene: "night",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "Strip away the parts between commas. What is left?",
  tag: "lost_in_syntax",
  rounds: [
    { say: "Find the spine of the sentence.", read: "It was not until the house, so long the pride of the county, had been sold to strangers, that Miss Ardley, who had never wept, wept.", rows: [["who?", "Miss Ardley"], ["did what?", "wept"], ["when?", "after the house was sold"]], extra: "the strangers|", trap: [0, "the strangers"], why: "The strangers only buy the house. The sentence is built around Miss Ardley.", win: "Miss Ardley wept after the sale." },
    { say: "What do the extra phrases add?", read: "It was not until the house, so long the pride of the county, had been sold to strangers, that Miss Ardley, who had never wept, wept.", rows: [["so long the pride of the county", "what the house meant"], ["who had never wept", "how rare her tears are"]], extra: "who bought it|", trap: [1, "who bought it"], why: "That phrase is about her, not the buyers. It makes the weeping remarkable.", win: "Modifiers carry the feeling." },
    { say: "Find the spine by yourself.", read: "Whatever the doctor, with his careful voice and folded hands, may have intended, the widow, hearing only the word months, rose and left.", rows: [["who?", "the widow"], ["did what?", "rose and left"], ["why?", "she heard “months”"]], extra: "the doctor|", trap: [0, "the doctor"] },
  ],
}));
