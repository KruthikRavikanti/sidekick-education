// Long or Short?. Skill RF.2.3-1.
// Distinguishing long and short vowels when reading regularly spelled one-syllable words. Reading all vowels as short is the known slip.
Sidekick.game(Sidekick.play({
  title: "Long or Short?",
  emoji: "🌲",
  premise: "A vowel can be short, like the i in pin, or long, like the i in pine. Spelling gives you the clue.",
  outro: "A final e or a vowel team usually makes the vowel long.",
  scene: "forest",
  kind: "sort",
  fs: 5.6,
  hint: "Is there a silent e at the end, or two vowels together?",
  tag: "reads_all_vowels_short",
  rounds: [
    { say: "Does the word have a short vowel or a long vowel?", bins: "Short vowel|Long vowel", items: ["pin ran hop", "pine rain hope"], trap: ["pine", 0], why: "Pine ends in a silent e. That makes the i say its name.", win: "Short and long vowels." },
    { say: "Sort these words.", bins: "Short vowel|Long vowel", items: ["cut men bit", "cute mean bite"], trap: ["mean", 0], why: "Two vowels together, e and a, make the long e sound.", win: "You heard the difference." },
    { say: "Sort these by yourself.", bins: "Short vowel|Long vowel", items: ["tap not kit bed", "tape note kite bead"], trap: ["bead", 0] },
  ],
}));
