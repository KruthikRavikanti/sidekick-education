// Snap the Word Together. Skill RF.K.2-3.
// Blending onsets and rimes of single-syllable words: the child joins a first sound and a rime to match a picture. Not hearing the parts as a word is the known slip.
Sidekick.game(Sidekick.play({
  title: "Snap the Word Together",
  emoji: "🧲",
  premise: "A word has a first sound and a rest. Snap the two parts together to name the picture.",
  outro: "Blend the first sound with the rest of the word: c and at make cat.",
  scene: "desk",
  kind: "row",
  fs: 8,
  hint: "Say the first sound. Then slide into the rest.",
  tag: "cannot_blend_parts",
  rounds: [
    { say: "Snap two parts together to make the word for the picture.", pic: "🐱", seq: "c at", extra: "h og", trap: "h at", why: "That says hat. The picture is a cat.", win: "C and at make cat." },
    { say: "Make the word for this picture.", pic: "🐷", seq: "p ig", extra: "d og", trap: "d ig", why: "That says dig. The picture is a pig.", win: "P and ig make pig." },
    { say: "Make the word by yourself.", alt: [{ pic: "☀️", seq: "s un", extra: "r at", trap: "r un" }, { pic: "🐶", seq: "d og", extra: "l ip", trap: "l og" }, { pic: "🛏️", seq: "b ed", extra: "r ug", trap: "r ed" }] },
  ],
}));
