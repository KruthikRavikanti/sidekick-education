// How Characters Talk. Skill L.5.3-2.
// Comparing and contrasting the varieties of English (dialects, registers) used in stories, dramas or poems. Not noticing dialect is the known slip.
Sidekick.game(Sidekick.play({
  title: "How Characters Talk",
  emoji: "🗣️",
  premise: "Authors sometimes write the way a character really speaks. Dialect and register show where someone is from and who they are.",
  outro: "Varieties of English in stories reveal a character’s background, setting and personality.",
  scene: "forest",
  kind: "fill",
  cast: "",
  hint: "What does the way they speak tell you about the character?",
  tag: "does_not_notice_dialect",
  rounds: [
    { say: "What does each way of speaking show about the character?", rows: [["\"I ain’t goin’ nowhere,\" said the old rancher.", "casual, country speech"], ["\"I shall not be leaving,\" said the duchess.", "formal, upper-class speech"]], extra: "the author made a slip|", trap: [0, "the author made a slip"], why: "The author chose those words on purpose, to show how he really talks.", win: "Speech reveals the character." },
    { say: "Match each line to who is probably speaking.", rows: [["\"Ahoy! Hoist the mainsail, mates!\"", "a sailor"], ["\"Kindly pass the tea, if you please.\"", "a formal host"], ["\"Dude, that was awesome!\"", "a modern teenager"]], trap: [1, "a sailor"], why: "Tea and kindly point to someone formal and polite.", win: "Word choice signals the speaker." },
    { say: "What does each way of speaking show? Match by yourself.", rows: [["\"Y’all come back now, hear?\"", "a friendly regional voice"], ["\"The data indicate a clear trend.\"", "a scientific, formal voice"]], extra: "a spelling mistake|nothing at all", trap: [0, "a spelling mistake"] },
  ],
}));
