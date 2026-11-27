// When Things Act Human. Skill L.6.5-1.
// Interpreting figures of speech such as personification in context. Reading them literally is the known slip.
Sidekick.game(Sidekick.play({
  title: "When Things Act Human",
  emoji: "🌬️",
  premise: "Personification gives human actions to things that are not human. The wind cannot whisper, but saying so paints a picture.",
  outro: "Personification describes a non-human thing as if it were a person.",
  scene: "forest",
  kind: "sort",
  fs: 4.6,
  hint: "Is a thing doing something only a person can do?",
  tag: "literal_reading",
  rounds: [
    { say: "Personification, or literal?", bins: "Personification|Literal", items: ["The wind whispered through the trees.|The alarm clock yelled at me.", "The wind blew through the trees.|The alarm clock rang."], trap: ["The alarm clock yelled at me.", 1], why: "Clocks cannot yell. A human action is given to a thing.", win: "Whispering and yelling are human." },
    { say: "What does each one really mean?", kind: "fill", fs: 4.8, cast: "", rows: [["The wind whispered.", "it blew softly"], ["The sun smiled on us.", "it shone warmly"], ["The stairs groaned.", "they creaked"]], extra: "it spoke words|", trap: [0, "it spoke words"], why: "Wind has no voice. Whispered means it was soft and quiet.", win: "Soft wind, warm sun, creaky stairs." },
    { say: "Sort these by yourself.", bins: "Personification|Literal", items: ["The flowers danced in the breeze.|My phone begged for a charger.", "The flowers moved in the breeze.|My phone battery was low."], trap: ["My phone begged for a charger.", 1] },
  ],
}));
