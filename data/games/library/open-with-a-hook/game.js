// Open With a Hook. Skill W.9-10.3-1.
// Engaging and orienting the reader by setting out a problem, situation or observation. Writing a flat opening is the known slip.
Sidekick.game(Sidekick.play({
  title: "Open With a Hook",
  emoji: "🪝",
  premise: "A story should start in the middle of something: a problem, a strange situation, a sharp observation.",
  outro: "Engage the reader by setting out a problem, situation or observation and a clear point of view.",
  scene: "night",
  kind: "sort",
  fs: 4.4,
  hint: "Does the first line make you ask a question?",
  tag: "flat_opening",
  rounds: [
    { say: "Engaging opening or flat one?", bins: "Engaging|Flat", items: ["The letter arrived three years after the man who wrote it had died.|By the time I found the key, the door was already open.", "This is a story about a letter.|I am going to tell you about my day."], trap: ["This is a story about a letter.", 0], why: "It announces a story but starts none. Nothing makes us curious yet.", win: "A good opening raises a question." },
    { say: "What does each opening set up?", kind: "fill", fs: 4.2, cast: "", rows: [["a problem", "The bus was gone, and so was my wallet."], ["a situation", "On Tuesdays the town ignored the tower."], ["an observation", "My brother whistles only when he lies."]], trap: [0, "My brother whistles only when he lies."], why: "That is a noticing about a person. The problem is the missing bus and wallet.", win: "Problem, situation, observation." },
    { say: "Sort these openings by yourself.", bins: "Engaging|Flat", items: ["Nobody had told the new girl about the fourth floor.|The phone rang twice and then, worse, it stopped.", "Hello, my name is Sam and this is my story.|One day something happened."], trap: ["One day something happened.", 0] },
  ],
}));
