// Dictionary Entry. Skill L.3.4-4.
// Using glossaries or beginning dictionaries to determine or clarify the precise meaning of key words. Not checking is the known slip.
Sidekick.game(Sidekick.play({
  title: "Dictionary Entry",
  emoji: "🦉",
  premise: "A dictionary entry tells what a word means. Some words have more than one meaning listed.",
  outro: "Use a dictionary or glossary to find the exact meaning of a word.",
  scene: "night",
  kind: "fill",
  cast: "",
  hint: "Read the entry. Which meaning is listed there?",
  tag: "does_not_check",
  rounds: [
    { say: "Use the entries. Match each word to its meaning.", fig: { type: "table", rows: [["nocturnal", "active at night"], ["diurnal", "active in the day"]] }, rows: [["nocturnal", "active at night"], ["diurnal", "active in the day"]], extra: "able to fly|", trap: [0, "able to fly"], why: "Find nocturnal in the entries and read across.", win: "Nocturnal animals are active at night." },
    { say: "The word bat has two entries. Which meaning fits each sentence?", fig: { type: "table", rows: [["bat (1)", "a flying animal"], ["bat (2)", "a stick for hitting a ball"]] }, rows: [["A bat flew from the cave.", "a flying animal"], ["She swung the bat.", "a stick for hitting a ball"]], extra: "a kind of hat|", trap: [1, "a flying animal"], why: "You swing a stick, not an animal. Use meaning 2.", win: "Two meanings, each in its place." },
    { say: "Use the entries by yourself.", fig: { type: "table", rows: [["predator", "an animal that hunts"], ["prey", "an animal that is hunted"]] }, rows: [["predator", "an animal that hunts"], ["prey", "an animal that is hunted"]], extra: "a kind of plant|a place to hide", trap: [1, "an animal that hunts"] },
  ],
}));
