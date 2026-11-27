// However, Although, Moreover. Skill L.5.6-1.
// Using grade-appropriate academic words and phrases, including those that signal contrast, addition and other logical relationships. Using only and and but is the known slip.
Sidekick.game(Sidekick.play({
  title: "However, Although, Moreover",
  emoji: "🔀",
  premise: "And and but are fine, but richer words say more. However and although show contrast. Moreover and in addition add.",
  outro: "Use academic words that signal contrast, addition and other logical relationships.",
  scene: "desk",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Is the second idea a contrast, or one more point of the same kind?",
  tag: "only_and_and_but",
  rounds: [
    { say: "Drop in the word that fits.", rows: [["The hike was long. ___, the view was worth it.", "However"], ["The hike was long. ___, it was steep.", "Moreover"]], extra: "Because", trap: [1, "However"], why: "Steep is one more hard thing, not a contrast. Moreover adds.", win: "However contrasts. Moreover adds." },
    { say: "Drop in these words.", rows: [["___ it rained, we finished the game.", "Although"], ["She studied hard. ___, she aced the test.", "Similarly"], ["The plan is cheap. ___, it is quick.", "In addition"]], trap: [0, "In addition"], why: "We finished in spite of the rain. Although shows that contrast.", win: "Contrast, similarity and addition." },
    { say: "Drop these in by yourself.", rows: [["He was tired. ___, he kept running.", "Nevertheless"], ["The soup was hot. ___, it was delicious.", "Moreover"], ["___ the bus was late, we arrived on time.", "Although"]], extra: "Because", trap: [0, "Moreover"] },
  ],
}));
