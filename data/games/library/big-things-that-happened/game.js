// Big Things That Happened. Skill RL.K.3-2.
// Identifying major events in a story. Listing small details as major events is the known slip.
Sidekick.game(Sidekick.play({
  title: "Big Things That Happened",
  emoji: "⛈️",
  premise: "Stories have big events and tiny details. The big events are the ones the story could not do without.",
  outro: "A major event is something important that happens in the story.",
  scene: "sky",
  kind: "pick",
  hint: "Would the story still work without it? Then it is a small detail.",
  tag: "lists_small_details",
  rounds: [
    { say: "Read the story. Tap the big things that happened.", read: "A big storm came. A bird hid. The old tree fell on the road. The yellow bus had to stop.", yes: "A storm came.|The tree fell.|The bus had to stop.", no: "The bus was yellow.|A bird hid.", trap: "The bus was yellow.", why: "The color of the bus is a small detail. It did not change the story.", win: "Storm, tree, bus." },
    { say: "Read this story. Tap the big things that happened.", read: "Lee lost his red hat at the park. He looked under a bench. A girl found it and gave it back.", yes: "Lee lost his hat.|A girl gave it back.", no: "The hat was red.|There was a bench.|It was a park.", trap: "The hat was red.", why: "Red is a detail about the hat. Losing it is the big event.", win: "Lost, then found." },
    { say: "Tap the big things that happened, by yourself.", read: "A small pup fell in a deep hole. It barked and barked. A man with a tall ladder got it out.", yes: "A pup fell in a hole.|A man got it out.", no: "The ladder was tall.|The pup was small.|The hole was deep.", trap: "The ladder was tall." },
  ],
}));
