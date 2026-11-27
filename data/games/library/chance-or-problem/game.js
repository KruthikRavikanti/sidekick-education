// Chance or Problem?. Skill 7.SP.C.7-3.
// Comparing probabilities from a model to observed frequencies and explaining discrepancies. Thinking any difference means the model does not fit is the known slip.
Sidekick.game(Sidekick.play({
  title: "Chance or Problem?",
  emoji: "🧪",
  premise: "Experiments never match the theory exactly. Small differences are chance. Huge differences mean the model may not fit.",
  outro: "Small differences between theory and experiment are expected. Large ones call the model into question.",
  scene: "desk",
  kind: "sort",
  fs: 5.2,
  hint: "Is the result close to what was expected, or far away?",
  tag: "any_difference_breaks_model",
  rounds: [
    { say: "Read the note. Sort each result.", q: "A fair die should show 5 about 10 times in 60 rolls.", bins: "Could be chance|Looks off", items: ["5 shows 13 times|5 shows 8 times", "5 shows 40 times|5 shows 0 times"], trap: ["5 shows 13 times", 1], why: "13 is close to 10. Small differences happen by chance.", win: "Near 10 is fine. 40 or 0 is suspicious." },
    { say: "Sort each result.", q: "A fair coin should land heads about 50 times in 100 flips.", bins: "Could be chance|Looks off", items: ["heads 47 times|heads 54 times", "heads 95 times|heads 3 times"], trap: ["heads 54 times", 1], why: "54 is close to 50.", win: "Close is chance. Far is a clue." },
    { say: "Sort these by yourself.", q: "A fair 4-part spinner should land on red about 25 times in 100.", bins: "Could be chance|Looks off", items: ["red 28 times|red 22 times", "red 70 times|red 1 time"], trap: ["red 28 times", 1] },
  ],
}));
