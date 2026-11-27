// Vivid Verb Swap. Skill L.3.3-1.
// Choosing words and phrases for effect. Repeating the same plain words is the known slip.
Sidekick.game(Sidekick.play({
  title: "Vivid Verb Swap",
  emoji: "🐕",
  premise: "Went is a tired verb. Dashed, crept and wandered each show a different picture.",
  outro: "Choose words for effect: a precise verb shows exactly how something happened.",
  scene: "meadow",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Which word shows HOW it moved?",
  tag: "repeats_plain_words",
  rounds: [
    { say: "Swap went for a verb that fits the picture.", rows: [["The excited dog ___ across the yard.", "dashed"], ["The tired dog ___ across the yard.", "trudged"]], extra: "went", trap: [0, "went"], why: "Went tells nothing about how. An excited dog dashes.", win: "Dashed and trudged show two different dogs." },
    { say: "Swap said for a verb that fits.", rows: [["\"Help!\" she ___.", "screamed"], ["\"Be very quiet,\" he ___.", "whispered"], ["\"I am not going,\" she ___.", "grumbled"]], extra: "said", trap: [1, "said"], why: "Said is plain. Someone asking for quiet whispers.", win: "Screamed, whispered and grumbled." },
    { say: "Pick the vivid word by yourself.", rows: [["The mouse ___ under the door.", "scurried"], ["The giant ___ through the forest.", "stomped"], ["The leaf ___ to the ground.", "drifted"]], extra: "went moved", trap: [0, "went"] },
  ],
}));
