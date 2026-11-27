// Clear Focus. Skill W.5.2-1.
// Introducing a topic clearly with a general observation and focus, grouping related information logically. Unfocused writing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Clear Focus",
  emoji: "🔭",
  premise: "Informative writing needs a clear focus. Everything in it should serve that focus and be grouped logically.",
  outro: "State a clear focus, then include only information that fits it.",
  scene: "space",
  kind: "sort",
  hint: "Does this sentence serve the focus?",
  tag: "unfocused",
  rounds: [
    { say: "Focus: how astronauts live in space. Sort the sentences.", bins: "Fits the focus|Off focus", items: ["They sleep strapped to a wall.|Food comes in sealed pouches.", "Rockets were invented in China.|Mars is called the red planet."], trap: ["Rockets were invented in China.", 0], why: "That is about rocket history, not daily life in space.", win: "Everything serves the focus." },
    { say: "Focus: why the Dust Bowl happened. Sort the sentences.", bins: "Fits the focus|Off focus", items: ["Farmers plowed up the prairie grass.|A long drought dried the soil.", "Many families owned radios.|Wheat is used to make bread."], trap: ["Wheat is used to make bread.", 0], why: "True, but it does not explain why the Dust Bowl happened.", win: "A tight focus." },
    { say: "Focus: how bees communicate. Sort by yourself.", bins: "Fits the focus|Off focus", items: ["A waggle dance shows direction.|Scents warn the hive of danger.", "Honey never spoils.|Beekeepers wear white suits."], trap: ["Honey never spoils.", 0] },
  ],
}));
