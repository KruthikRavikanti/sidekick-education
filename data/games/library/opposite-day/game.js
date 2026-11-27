// Opposite Day. Skill L.K.5-2.
// Relating verbs and adjectives to their opposites. Giving a related word instead of the opposite is the known slip.
Sidekick.game(Sidekick.play({
  title: "Opposite Day",
  emoji: "🔥",
  premise: "Opposites are as different as can be: hot and cold, up and down, big and small.",
  outro: "An opposite is the most different word, not just a word about the same thing.",
  scene: "snow",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Which word means the most different thing?",
  tag: "gives_related_word",
  rounds: [
    { say: "Give each word its opposite.", rows: [["🔥 hot", "cold"], ["⬆️ up", "down"]], extra: "warm", trap: [0, "warm"], why: "Warm is close to hot. The opposite is as different as can be.", win: "Hot and cold. Up and down." },
    { say: "Match these opposites.", rows: [["🐘 big", "small"], ["😊 happy", "sad"], ["🌞 day", "night"]], extra: "huge", trap: [0, "huge"], why: "Huge means very big. The opposite of big is small.", win: "Big and small, happy and sad, day and night." },
    { say: "Match these by yourself.", rows: [["🐇 fast", "slow"], ["🚪 open", "shut"], ["⬆️ go", "stop"]], extra: "quick run", trap: [0, "quick"] },
  ],
}));
