// Curious or Nosy. Skill L.9-10.5-2.
// Analyzing nuances in the meaning of words with similar denotations. Treating such words as interchangeable is the known slip.
Sidekick.game(Sidekick.play({
  title: "Curious or Nosy",
  emoji: "🌡️",
  premise: "Curious and nosy describe the same habit. One is a compliment. The other is a complaint.",
  outro: "Words with similar denotations carry different connotations. Choose the one with the feeling you intend.",
  scene: "desk",
  kind: "sort",
  fs: 5.2,
  hint: "Would you be pleased or annoyed to be called this?",
  tag: "interchanges_words",
  rounds: [
    { say: "Each pair means nearly the same. Which word feels positive and which negative?", bins: "Positive or neutral|Negative", items: ["curious|thrifty|confident", "nosy|stingy|arrogant"], trap: ["nosy", 0], why: "Nosy suggests prying where you are not wanted.", win: "Same idea, different feeling." },
    { say: "Match each neutral word to its harsher twin.", kind: "fill", fs: 5.2, cast: "", rows: [["slender", "scrawny"], ["determined", "stubborn"], ["youthful", "childish"]], extra: "graceful", trap: [0, "graceful"], why: "Graceful is kinder still. The harsher twin of slender is scrawny.", win: "Connotation shifts the picture." },
    { say: "Sort these by yourself.", bins: "Positive or neutral|Negative", items: ["assertive|unique|relaxed", "pushy|weird|lazy"], trap: ["pushy", 0] },
  ],
}));
