// What Is It About?. Skill W.K.2-1.
// Naming the topic of an informative piece: the child reads clues and names what the writing is about. Writing a story instead of naming a topic is the known slip.
Sidekick.game(Sidekick.play({
  title: "What Is It About?",
  emoji: "✏️",
  premise: "When you write to teach, you start by naming what you are writing about. That is your topic.",
  outro: "Name your topic first, so readers know what the writing is about.",
  scene: "paper",
  kind: "pick",
  fs: 5,
  hint: "What is every sentence about?",
  tag: "does_not_name_topic",
  rounds: [
    { say: "Read the writing. Tap what it is about.", read: "It has four legs. It barks. It wags its tail.", yes: "🐶 a dog|", no: "🐟 a fish|🚗 a car|🌳 a tree", trap: "🐟 a fish", why: "A fish does not bark. Read the clues again.", win: "This writing is about a dog." },
    { say: "Read this writing. Tap what it is about.", read: "It is hot. It is in the sky. It gives us light.", yes: "☀️ the sun|", no: "🌙 the moon|🔥 a fire|💡 a lamp", trap: "🌙 the moon", why: "The moon is not hot. Read the clues again.", win: "This writing is about the sun." },
    { say: "Tap the topic by yourself.", read: "It has wings. It makes a nest. It lays eggs.", yes: "🐦 a bird|", no: "🐝 a bee|✈️ a plane|🐱 a cat|🐟 a fish|🦋 a butterfly", trap: "✈️ a plane" },
  ],
}));
