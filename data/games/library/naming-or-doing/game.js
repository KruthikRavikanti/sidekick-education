// Naming or Doing. Skill L.K.1-2.
// Using frequently occurring nouns and verbs: words are sorted into naming words and doing words. Leaving out or not recognizing the verb is the known slip.
Sidekick.game(Sidekick.play({
  title: "Naming or Doing",
  emoji: "🏃",
  premise: "Some words name a thing. Other words tell what something does. A sentence needs both.",
  outro: "A noun names a person, place or thing. A verb tells what it does.",
  scene: "field",
  kind: "sort",
  fs: 5,
  hint: "Can you do it? Then it is a doing word.",
  tag: "does_not_spot_the_verb",
  rounds: [
    { say: "Is it a naming word or a doing word?", bins: "Naming word|Doing word", items: ["🐶 dog|🏠 house", "🏃 run|🦘 jump"], trap: ["🏃 run", 0], why: "Run is something you do.", win: "Things, and things you do." },
    { say: "Sort these words.", bins: "Naming word|Doing word", items: ["🍎 apple|🚗 car|👧 girl", "🏊 swim|😴 sleep"], trap: ["😴 sleep", 0], why: "Sleep is something you do.", win: "Nouns and verbs." },
    { say: "Sort these by yourself.", bins: "Naming word|Doing word", items: ["🐟 fish|🌳 tree|🎩 hat", "🍽️ eat|🎤 sing|🤸 hop"], trap: ["🎤 sing", 0] },
  ],
}));
