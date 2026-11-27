// Hyphen or No Hyphen. Skill L.11-12.2-1.
// Observing hyphenation conventions. Misusing hyphens is the known slip.
Sidekick.game(Sidekick.play({
  title: "Hyphen or No Hyphen",
  emoji: "➖",
  premise: "Two words that act as one describer before a noun are joined by a hyphen. After the noun, they usually stand apart.",
  outro: "Hyphenate compound modifiers before a noun: a well-known author. No hyphen after the noun or after an -ly adverb.",
  scene: "desk",
  kind: "sort",
  fs: 4.6,
  hint: "Do the two words together describe the noun that comes right after them?",
  tag: "misuses_hyphen",
  rounds: [
    { say: "Does the phrase need a hyphen?", bins: "Hyphen needed|No hyphen", items: ["a well known author|a ten year old boy", "the author is well known|the boy is ten years old"], trap: ["the author is well known", 0], why: "Here the words follow the noun, so they stay separate.", win: "Before the noun: join them." },
    { say: "Choose the correctly written phrase for each sentence.", kind: "fill", fs: 4.6, cast: "", rows: [["She signed a ___ lease.", "long-term"], ["The lease runs for the ___.", "long term"], ["It was a ___ film.", "highly praised"]], extra: "highly-praised", trap: [2, "highly-praised"], why: "An adverb ending in -ly already points to the next word. No hyphen.", win: "Join before a noun, but never after -ly." },
    { say: "Sort these by yourself.", bins: "Hyphen needed|No hyphen", items: ["a full time job|a last minute change", "she works full time|a newly built bridge"], trap: ["a newly built bridge", 0] },
  ],
}));
