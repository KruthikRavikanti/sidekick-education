// Root Detectives. Skill L.5.4-2.
// Using common Greek and Latin affixes and roots as clues to word meaning (photograph, photosynthesis). Not using roots is the known slip.
Sidekick.game(Sidekick.play({
  title: "Root Detectives",
  emoji: "📸",
  premise: "Words that share a Greek or Latin root share a piece of meaning. Photo means light, so a photograph is written with light.",
  outro: "Use Greek and Latin roots and affixes to work out related words.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "What does the shared root mean? How does it fit each word?",
  tag: "does_not_use_roots",
  rounds: [
    { say: "Photo means light. Match each word to its meaning.", rows: [["photograph", "a picture made with light"], ["photosynthesis", "making food using light"]], extra: "a kind of plant|", trap: [1, "a kind of plant"], why: "Photo is light, and synthesis is putting together.", win: "Both words are about light." },
    { say: "Aqua means water. Terra means earth. Match each word.", rows: [["aquarium", "a tank of water for fish"], ["territory", "an area of land"], ["aquatic", "living in water"]], trap: [1, "living in water"], why: "Terra means earth. Territory is land.", win: "Water words and earth words." },
    { say: "Spect means look. Dict means say. Match by yourself.", rows: [["inspect", "look closely"], ["predict", "say before it happens"], ["spectator", "one who watches"]], extra: "one who talks|", trap: [2, "one who talks"] },
  ],
}));
