// Count the Beats. Skill RF.1.3-4.
// Knowing that every syllable must have a vowel sound, used to determine the number of syllables in a word. Not being able to split words into syllables is the known slip.
Sidekick.game(Sidekick.play({
  title: "Count the Beats",
  emoji: "🐰",
  premise: "Every beat in a word has a vowel sound in it. Say the word and count how many beats you hear.",
  outro: "Every syllable has one vowel sound. Count the vowel sounds to count the syllables.",
  scene: "meadow",
  kind: "sort",
  fs: 5.4,
  hint: "Put your hand under your chin. It drops once for every beat.",
  tag: "cannot_count_syllables",
  rounds: [
    { say: "Say each word. How many beats does it have?", bins: "1 beat|2 beats", items: ["cat sun frog", "rabbit napkin"], trap: ["rabbit", 0], why: "Say it slowly: rab-bit. That is two beats.", win: "One beat and two beats." },
    { say: "Now some words have three beats.", bins: "1 beat|2 beats|3 beats", items: ["ship jump", "sunset pencil", "banana fantastic"], trap: ["fantastic", 1], why: "Say it slowly: fan-tas-tic. That is three beats.", win: "One, two and three beats." },
    { say: "Sort these by yourself.", bins: "1 beat|2 beats|3 beats", items: ["desk milk", "kitten basket", "elephant umbrella"], trap: ["elephant", 1] },
  ],
}));
