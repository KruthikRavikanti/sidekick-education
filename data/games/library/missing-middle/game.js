// Missing Middle. Skill L.K.2-3.
// Writing a letter for most consonant and short-vowel sounds: the missing vowel of a CVC word is supplied. Writing only the consonants is the known slip.
Sidekick.game(Sidekick.play({
  title: "Missing Middle",
  emoji: "🧩",
  premise: "Every little word has a vowel sound in the middle. Listen for it and drop in the letter.",
  outro: "Every word needs a vowel. Say the word slowly to hear the middle sound.",
  scene: "desk",
  kind: "fill",
  fs: 8,
  pSize: 7,
  cast: "",
  hint: "Say the word slowly. What sound is in the middle?",
  tag: "leaves_out_vowels",
  rounds: [
    { say: "Drop in the middle letter.", rows: [["☀️ s ___ n", "u"], ["🐷 p ___ g", "i"]], extra: "a o", trap: [0, "a"], why: "Say it slowly: s-u-n. The middle sound is u.", win: "Sun and pig." },
    { say: "Drop in the middle letters.", rows: [["🛏️ b ___ d", "e"], ["🐱 c ___ t", "a"], ["🐶 d ___ g", "o"]], extra: "u", trap: [0, "a"], why: "Say it slowly: b-e-d. The middle sound is e.", win: "Bed, cat and dog." },
    { say: "Drop in the letters by yourself.", rows: [["🎩 h ___ t", "a"], ["🚌 b ___ s", "u"], ["🖊️ p ___ n", "e"], ["📦 b ___ x", "o"]], extra: "i", trap: [1, "a"] },
  ],
}));
