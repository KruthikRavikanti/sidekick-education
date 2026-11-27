// If I Were. Skill L.8.1-3.
// Forming and using verbs in the indicative, imperative, interrogative, conditional and subjunctive moods. Writing If I was is the known slip.
Sidekick.game(Sidekick.play({
  title: "If I Were",
  emoji: "🌠",
  premise: "For wishes and things that are not real, English uses were, even with I, he and she.",
  outro: "Subjunctive mood: If I were taller. I wish she were here.",
  scene: "night",
  kind: "fill",
  fs: 4.8,
  cast: "",
  hint: "Is it a wish or something unreal? Then use were.",
  tag: "if_i_was",
  rounds: [
    { say: "Drop in the verb that fits.", rows: [["If I ___ taller, I would play center.", "were"], ["Yesterday I ___ late for practice.", "was"]], extra: "is", trap: [0, "was"], why: "Being taller is imagined, not real. Use were.", win: "Unreal: were. Real past: was." },
    { say: "What mood is each sentence?", kind: "sort", fs: 4.6, bins: "Indicative|Imperative|Interrogative", items: ["The bus leaves at noon.|", "Close the door.|", "Did you close the door?|"], trap: ["Close the door.", 0], why: "It gives a command. That is the imperative mood.", win: "Statement, command, question." },
    { say: "Fill these by yourself.", rows: [["I wish she ___ here.", "were"], ["If he ___ the captain, we would win.", "were"], ["Last year she ___ the captain.", "was"]], extra: "is", trap: [2, "were"] },
  ],
}));
