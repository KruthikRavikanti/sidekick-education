// Sound Dots. Skill RF.1.2-4.
// Segmenting spoken single-syllable words into their complete sequence of individual sounds. Segmenting by syllable, or counting letters, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sound Dots",
  emoji: "🔵",
  premise: "Break a word into every little sound. Push up one dot for each sound you say.",
  outro: "A word can have more sounds than beats, and fewer sounds than letters.",
  scene: "candy",
  kind: "dial",
  cast: "",
  dials: [["Sounds", 0, 6]],
  view: { type: "mix", icons: "🔵" },
  hint: "Stretch the word like a rubber band. Count each sound.",
  tag: "segments_by_syllable",
  rounds: [
    { say: "Say frog slowly. Set one dot for each sound.", pic: "🐸", ans: [4], trap: [1], why: "Frog is one beat, but it has four sounds: f, r, o, g.", win: "F-r-o-g. Four sounds." },
    { say: "Say cat slowly. Set one dot for each sound.", pic: "🐱", ans: [3], trap: [1], why: "Cat has three sounds: c, a, t.", win: "C-a-t. Three sounds." },
    { say: "Count the sounds by yourself.", alt: [{ say: "Say ship. Set one dot for each sound.", pic: "🚢", ans: [3], trap: [4] }, { say: "Say stop. Set one dot for each sound.", pic: "🛑", ans: [4], trap: [1] }, { say: "Say fish. Set one dot for each sound.", pic: "🐟", ans: [3], trap: [4] }] },
  ],
}));
