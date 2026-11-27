// How They Connect. Skill RI.K.3-1.
// Describing the connection between two individuals, events or ideas in a text: stages are ordered to show how one becomes the next. Listing them without a connection is the known slip.
Sidekick.game(Sidekick.play({
  title: "How They Connect",
  emoji: "🦋",
  premise: "Fact books show how things are linked. One thing can grow and change into another.",
  outro: "Look for how two things in a book are connected, like a tadpole that becomes a frog.",
  scene: "meadow",
  kind: "row",
  hint: "Which one comes first? What does it turn into?",
  tag: "lists_without_connection",
  rounds: [
    { say: "Read the page. Put the cards in order to show how they connect.", read: "A tadpole comes out of an egg. It grows legs. Then it is a frog.", seq: "🥚 egg|🐟 tadpole|🐸 frog", trap: "reverse", why: "The frog comes last. It starts as an egg.", win: "An egg becomes a tadpole, and a tadpole becomes a frog." },
    { say: "Read this page. Show how they connect.", read: "A seed goes in the dirt. A small sprout pops up. It grows into a tall flower.", seq: "🌰 seed|🌱 sprout|🌻 flower", trap: "reverse", why: "The flower comes last. It starts as a seed.", win: "Seed, sprout, flower." },
    { say: "Show how they connect, by yourself.", read: "A caterpillar eats leaves. It makes a hard shell. Out comes a butterfly.", seq: "🐛 caterpillar|🫘 shell|🦋 butterfly", trap: "🦋 butterfly|🐛 caterpillar|🫘 shell" },
  ],
}));
