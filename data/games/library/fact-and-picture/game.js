// Fact and Picture. Skill RI.K.7-1.
// Describing the relationship between illustrations and the text in an informational book. Describing the picture alone is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fact and Picture",
  emoji: "🕸️",
  premise: "In a fact book, the pictures show what the words are teaching. Match each fact to its picture.",
  outro: "The picture shows the same idea as the words next to it.",
  scene: "forest",
  kind: "fill",
  cast: "",
  hint: "Read the fact. Which picture shows it?",
  tag: "describes_picture_alone",
  rounds: [
    { say: "Give each fact its picture.", rows: [["Bees make honey.", "🍯"], ["Birds build nests.", "🪺"], ["Spiders spin webs.", "🕸️"]], extra: "🥛", trap: [0, "🥛"], why: "The words say honey. Find the honey.", win: "Each picture shows its fact." },
    { say: "Match these.", rows: [["Rain falls from clouds.", "🌧️"], ["The sun gives us light.", "☀️"], ["Snow is cold and white.", "❄️"]], extra: "🌈", trap: [2, "🌈"], why: "The words say snow. Find the snow.", win: "Facts and pictures go together." },
    { say: "Match these by yourself.", rows: [["Cows give us milk.", "🥛"], ["Hens lay eggs.", "🥚"], ["Sheep give us wool.", "🧶"]], extra: "🍯 🧀", trap: [0, "🧀"] },
  ],
}));
