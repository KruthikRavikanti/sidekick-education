// Across the Bridge. Skill L.1.1-9.
// Using frequently occurring prepositions such as during, beyond and toward. Leaving them out or mixing them up is the known slip.
Sidekick.game(Sidekick.play({
  title: "Across the Bridge",
  emoji: "🌉",
  premise: "Words like across, toward, during and beyond tell where, which way, or when.",
  outro: "Across, toward and beyond tell where. During tells when.",
  scene: "city",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Does the sentence need a where word or a when word?",
  tag: "mixes_prepositions",
  rounds: [
    { say: "Drop in the word that fits.", rows: [["We walked ___ the bridge.", "across"], ["Be quiet ___ the movie.", "during"]], extra: "beyond", trap: [0, "during"], why: "During tells when. You walk across a bridge.", win: "Across the bridge, during the movie." },
    { say: "Drop in these words.", rows: [["The dog ran ___ me.", "toward"], ["The hills are far ___ the town.", "beyond"], ["We ate popcorn ___ the show.", "during"]], trap: [0, "during"], why: "The dog ran in my direction: toward me.", win: "Toward, beyond and during." },
    { say: "Drop in the words by yourself.", rows: [["The duck swam ___ the pond.", "across"], ["Walk ___ the door.", "toward"], ["It rained ___ the night.", "during"]], extra: "beyond", trap: [2, "across"] },
  ],
}));
