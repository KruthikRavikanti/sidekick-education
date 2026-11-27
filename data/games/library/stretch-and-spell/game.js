// Stretch and Spell. Skill L.1.2-5.
// Spelling untaught words phonetically, drawing on phonemic awareness and spelling conventions. Leaving out or mixing up vowels is the known slip.
Sidekick.game(Sidekick.play({
  title: "Stretch and Spell",
  emoji: "💦",
  premise: "For a word you have not learned, stretch it out and write the sounds in order. Do not forget the vowel.",
  outro: "Stretch a new word and write a letter or letter team for each sound.",
  scene: "ocean",
  kind: "row",
  fs: 7.5,
  hint: "Say it slowly. What vowel sound is in the middle?",
  tag: "leaves_out_vowels",
  rounds: [
    { say: "Spell the word for the picture.", pic: "🐸", seq: "fr o g", extra: "u", trap: "fr u g", why: "Say it slowly: fr-o-g. The middle sound is o.", win: "Fr, o, g spells frog." },
    { say: "Spell this word.", pic: "🥁", seq: "dr u m", extra: "a", trap: "dr a m", why: "Say it slowly: dr-u-m. The middle sound is u.", win: "Dr, u, m spells drum." },
    { say: "Spell the word by yourself.", alt: [{ pic: "💦", seq: "spl a sh", extra: "i", trap: "spl i sh" }, { pic: "🚩", seq: "fl a g", extra: "o", trap: "fl o g" }, { pic: "🦀", seq: "cr a b", extra: "i", trap: "cr i b" }] },
  ],
}));
