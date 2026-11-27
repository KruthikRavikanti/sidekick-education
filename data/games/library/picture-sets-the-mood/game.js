// Picture Sets the Mood. Skill RL.3.7-1.
// Explaining how illustrations contribute to what the words convey: mood, character and setting. Describing the picture only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Picture Sets the Mood",
  emoji: "🕯️",
  premise: "An illustration adds feeling to a story. Dark colors, bright sun or a tiny figure all change the mood.",
  outro: "Illustrations add mood and show more about characters and setting.",
  scene: "night",
  kind: "fill",
  cast: "",
  hint: "How does the picture make the scene FEEL?",
  tag: "describes_picture_only",
  rounds: [
    { say: "The words say: Mia walked into the old house. What does each picture add?", rows: [["🌩️🏚️ dark clouds and broken windows", "a spooky mood"], ["🌞🏡 sunshine and flowers", "a cheerful mood"]], extra: "it shows a house|", trap: [0, "it shows a house"], why: "Yes, it shows a house. What FEELING does it add?", win: "Same words, different mood." },
    { say: "The words say: Ben stood on the stage. What does each picture add?", rows: [["😰 Ben is small, the crowd is huge", "he feels nervous"], ["😁 Ben has his arms raised high", "he feels proud"]], extra: "there is a stage|", trap: [1, "there is a stage"], why: "The words already said that. What does his pose show?", win: "The picture shows how he feels." },
    { say: "The words say: The boat left the dock. Match by yourself.", rows: [["🌊⛈️ tall waves and a black sky", "danger ahead"], ["🌅 calm water and a pink sky", "a peaceful start"]], extra: "it shows water|it is a boat", trap: [0, "it shows water"] },
  ],
}));
