// One Touch, One Word. Skill RF.K.1-2.
// Matching spoken words to written words: one finger is placed for each word in a sentence. Touching once per syllable is the known slip.
Sidekick.game(Sidekick.play({
  title: "One Touch, One Word",
  emoji: "👆",
  premise: "Every word you say matches one word on the page. Touch each word once as you read it.",
  outro: "One spoken word matches one written word, even when the word is long.",
  scene: "paper",
  kind: "build",
  cast: "",
  pile: [["👆", 1, 8]],
  show: "count",
  hint: "A long word is still just one word. Count the groups of letters.",
  tag: "one_touch_per_syllable",
  rounds: [
    { say: "Put one finger on the tray for each word.", read: "The dog ran.", goal: 3, trap: 4, why: "There are three groups of letters, so three words.", win: "Three words, three touches." },
    { say: "One finger for each word. One word is long.", read: "The puppy ran.", goal: 3, trap: 4, why: "Puppy has two beats, but it is one word.", win: "Puppy is one word." },
    { say: "One finger for each word, by yourself.", alt: [{ read: "My monkey is funny.", goal: 4, trap: 6 }, { read: "A tiger can run.", goal: 4, trap: 5 }] },
  ],
}));
