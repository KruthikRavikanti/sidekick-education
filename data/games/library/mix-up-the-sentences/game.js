// Mix Up the Sentences. Skill L.6.3-1.
// Varying sentence patterns for meaning, reader interest and style. Repetitive sentences are the known slip.
Sidekick.game(Sidekick.play({
  title: "Mix Up the Sentences",
  emoji: "🎼",
  premise: "Writing where every sentence has the same shape sounds like a drum with one beat. Vary the length and the beginnings.",
  outro: "Vary sentence patterns: combine short sentences, change how they begin, mix long and short.",
  scene: "desk",
  kind: "sort",
  fs: 4.6,
  hint: "Do the sentences all start the same way and run the same length?",
  tag: "repetitive_sentences",
  rounds: [
    { say: "Varied, or repetitive?", bins: "Varied|Repetitive", items: ["After waking up, I ate and left.|When the bell rang, we ran outside, laughing.", "I woke up. I ate. I left.|We ran. We laughed. We stopped."], trap: ["I woke up. I ate. I left.", 0], why: "Three short sentences in a row all start with I.", win: "Combining adds rhythm." },
    { say: "Sort these.", bins: "Varied|Repetitive", items: ["Tired but happy, the team rode home in silence.|The rain stopped. Slowly, the street filled with people.", "The dog barked. The dog ran. The dog sat.|She read. She wrote. She slept."], trap: ["She read. She wrote. She slept.", 0], why: "Every sentence is two words starting with She.", win: "Different lengths and beginnings keep interest." },
    { say: "Sort these by yourself.", bins: "Varied|Repetitive", items: ["Because the map was torn, we guessed the way.|Night fell. Far off, an owl called twice.", "He ran. He fell. He cried.|It was hot. It was dry. It was dusty."], trap: ["It was hot. It was dry. It was dusty.", 0] },
  ],
}));
