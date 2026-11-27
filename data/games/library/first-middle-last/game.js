// First, Middle, Last. Skill RF.1.2-3.
// Isolating initial, medial vowel and final sounds in single-syllable words. Skipping the vowel sound is the known slip.
Sidekick.game(Sidekick.play({
  title: "First, Middle, Last",
  emoji: "🚢",
  premise: "Every short word has a first sound, a vowel sound in the middle, and a last sound.",
  outro: "Listen for three places in a word: the first sound, the middle vowel and the last sound.",
  scene: "ocean",
  kind: "fill",
  fs: 6.4,
  cast: "",
  hint: "Say the word very slowly and stretch it.",
  tag: "skips_the_vowel",
  rounds: [
    { say: "Say ship. Which letters make each sound?", pic: "🚢", rows: [["first", "sh"], ["middle", "i"], ["last", "p"]], extra: "s", trap: [0, "s"], why: "S and h work together here to make one sound: sh.", win: "Sh, i, p." },
    { say: "Say fish. Which letters make each sound?", pic: "🐟", rows: [["first", "f"], ["middle", "i"], ["last", "sh"]], extra: "h", trap: [2, "h"], why: "Fish ends with the sh sound.", win: "F, i, sh." },
    { say: "Say the word. Find each sound by yourself.", alt: [{ pic: "🌙", rows: [["first", "m"], ["middle", "oo"], ["last", "n"]], extra: "a", trap: [1, "a"] }, { pic: "🧦", rows: [["first", "s"], ["middle", "o"], ["last", "ck"]], extra: "e", trap: [1, "e"] }] },
  ],
}));
