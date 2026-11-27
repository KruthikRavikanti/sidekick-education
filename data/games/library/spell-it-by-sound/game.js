// Spell It by Sound. Skill L.K.2-4.
// Spelling simple words phonetically using sound-letter knowledge. Using letters that do not match the sounds is the known slip.
Sidekick.game(Sidekick.play({
  title: "Spell It by Sound",
  emoji: "🐖",
  premise: "Say the word slowly and stretch it out. Then put down one letter for each sound you hear.",
  outro: "Stretch the word and write a letter for each sound, in order.",
  scene: "meadow",
  kind: "row",
  fs: 8,
  hint: "Stretch the word. What is the first sound? The next?",
  tag: "letters_do_not_match_sounds",
  rounds: [
    { say: "Spell the word for the picture.", pic: "🐷", seq: "p i g", extra: "b e", trap: "b i g", why: "That says big. Pig starts with p.", win: "P, i, g spells pig." },
    { say: "Spell this word.", pic: "☀️", seq: "s u n", extra: "a m", trap: "s a n", why: "Say it slowly: s-u-n. The middle sound is u.", win: "S, u, n spells sun." },
    { say: "Spell the word by yourself.", alt: [{ pic: "🐶", seq: "d o g", extra: "b u", trap: "b o g" }, { pic: "🎩", seq: "h a t", extra: "e n", trap: "h e t" }, { pic: "🚌", seq: "b u s", extra: "a d", trap: "b a s" }] },
  ],
}));
