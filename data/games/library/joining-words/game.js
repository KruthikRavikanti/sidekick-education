// Joining Words. Skill L.1.1-7.
// Using frequently occurring conjunctions. Using only and to join every pair of ideas is the known slip.
Sidekick.game(Sidekick.play({
  title: "Joining Words",
  emoji: "🪢",
  premise: "Joining words link two ideas. And adds, but turns, or gives a choice, so tells what happened next, and because tells why.",
  outro: "Pick the joining word that shows how two ideas fit: and, but, or, so, because.",
  scene: "desk",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "How do the two parts fit? A reason, a choice, a turn?",
  tag: "uses_only_and",
  rounds: [
    { say: "Drop in the joining word that fits.", rows: [["I wanted to play, ___ it was raining.", "but"], ["I wore a coat ___ it was cold.", "because"]], extra: "and", trap: [0, "and"], why: "The rain got in the way. The word but shows that turn.", win: "But for a turn, because for a reason." },
    { say: "Drop in these joining words.", rows: [["Do you want milk ___ juice?", "or"], ["I was tired, ___ I went to bed.", "so"], ["I like cats ___ dogs.", "and"]], trap: [1, "and"], why: "Being tired is why I went to bed. So shows that.", win: "Or, so and and." },
    { say: "Drop in the words by yourself.", rows: [["She ran fast ___ she was late.", "because"], ["I like peas, ___ I do not like beans.", "but"], ["Is it a frog ___ a toad?", "or"], ["It was hot, ___ we swam.", "so"]], extra: "and", trap: [1, "and"] },
  ],
}));
