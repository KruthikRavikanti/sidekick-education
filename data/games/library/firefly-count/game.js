// Firefly Count. Skill K.CC.B.4-1.
// One touch for one object: the child taps each named bug once and leaves the things that are not that bug, and the count goes up by one each tap.
Sidekick.game(Sidekick.play({
  title: "Firefly Count",
  emoji: "✨",
  premise: "Little bugs are out in the night garden. Tap each one the mission names, just one time.",
  outro: "One tap for each bug. That is how careful counters count.",
  scene: "night",
  kind: "pick",
  cast: "",
  hint: "Touch each one a single time. Leave the others alone.",
  tag: "counts_extra_object",
  rounds: [
    { say: "Tap every bee. Leave the flowers alone.", yes: "🐝 🐝 🐝 🐝", no: "🌼 🌷", trap: "🌼", why: "That one is a flower, not a bee. Count only the bees.", win: "Four bees, each tapped once." },
    { say: "Tap every ladybug, one time each.", yes: "🐞 🐞 🐞 🐞 🐞", no: "🍄 🍃 🌼", trap: "🍄", why: "The mushroom is not a ladybug. Only ladybugs count.", win: "Five ladybugs!" },
    { say: "Tap every butterfly once. Skip the rest.", yes: "🦋 🦋 🦋 🦋 🦋 🦋", no: "🌸 🍃 🐌", trap: "🐌" },
  ],
}));
