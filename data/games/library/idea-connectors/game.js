// Idea Connectors. Skill W.4.2-3.
// Linking ideas within categories of information using words and phrases. Using no linking words is the known slip.
Sidekick.game(Sidekick.play({
  title: "Idea Connectors",
  emoji: "🧲",
  premise: "Words like another, for example, also and because connect one idea to the next within a topic.",
  outro: "Link ideas with another, for example, also and because.",
  scene: "desk",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Is the next sentence an example, a reason, or one more of the same?",
  tag: "no_linking",
  rounds: [
    { say: "Drop in the connector that fits.", rows: [["Sharks have sharp teeth. ___, a great white has 300.", "For example"], ["Sharks must keep swimming ___ they need water over their gills.", "because"]], extra: "But", trap: [0, "But"], why: "The second sentence gives one case of the first. For example fits.", win: "An example, and a reason." },
    { say: "Drop in these connectors.", rows: [["Bees make honey. ___ product is beeswax.", "Another"], ["Bees dance ___ they share where flowers are.", "because"], ["Bees are insects. They ___ have six legs.", "also"]], trap: [0, "because"], why: "Beeswax is one more product. Another fits.", win: "Another, because and also." },
    { say: "Drop these in by yourself.", rows: [["Deserts are dry. ___, some get rain once a year.", "For example"], ["Plants there store water ___ rain is rare.", "because"], ["___ desert feature is extreme heat.", "Another"]], extra: "However", trap: [2, "However"] },
  ],
}));
