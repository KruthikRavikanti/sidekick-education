// Glossary Lookup. Skill L.2.4-5.
// Using glossaries and beginning dictionaries to determine or clarify the meaning of words. Never checking a reference is the known slip.
Sidekick.game(Sidekick.play({
  title: "Glossary Lookup",
  emoji: "📒",
  premise: "A glossary at the back of a book lists special words and what they mean. Look a word up when you are not sure.",
  outro: "Use a glossary or dictionary to find or check the meaning of a word.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "Find the word in the glossary. Read across to its meaning.",
  tag: "never_checks_reference",
  rounds: [
    { say: "Use the glossary. Match each word to its meaning.", fig: { type: "table", rows: [["habitat", "where an animal lives"], ["prey", "an animal that is hunted"]] }, rows: [["habitat", "where an animal lives"], ["prey", "an animal that is hunted"]], extra: "a kind of food|", trap: [0, "a kind of food"], why: "Find habitat in the glossary and read across.", win: "The glossary gave both meanings." },
    { say: "Use the glossary. Match each word to its meaning.", fig: { type: "table", rows: [["orbit", "to travel around"], ["crater", "a bowl-shaped hole"]] }, rows: [["orbit", "to travel around"], ["crater", "a bowl-shaped hole"]], extra: "a bright star|", trap: [1, "a bright star"], why: "Find crater in the glossary and read across.", win: "You used the glossary." },
    { say: "Use the glossary by yourself.", fig: { type: "table", rows: [["larva", "a young insect"], ["pupa", "the resting stage"], ["adult", "fully grown"]] }, rows: [["larva", "a young insect"], ["pupa", "the resting stage"]], extra: "fully grown|an egg", trap: [0, "fully grown"] },
  ],
}));
