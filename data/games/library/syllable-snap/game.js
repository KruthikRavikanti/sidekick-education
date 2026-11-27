// Syllable Snap. Skill RF.1.3-5.
// Decoding two-syllable words by breaking them into syllables. Reading only the first syllable is the known slip.
Sidekick.game(Sidekick.play({
  title: "Syllable Snap",
  emoji: "🧲",
  premise: "A long word is just two short parts snapped together. Read each part, then say them fast.",
  outro: "Break a long word into syllables, read each one, then put them together.",
  scene: "desk",
  kind: "row",
  fs: 7,
  hint: "Read the first part. Then read the second part. Now say them together.",
  tag: "reads_first_syllable_only",
  rounds: [
    { say: "Snap two parts together to make the word for the picture.", pic: "🐰", seq: "rab bit", extra: "nap kin", trap: "rab kin", why: "Read both parts. Rab and kin do not make a word.", win: "Rab and bit make rabbit." },
    { say: "Make the word for this picture.", pic: "🌅", seq: "sun set", extra: "pic nic", trap: "sun nic", why: "Read both parts. The picture is a sunset.", win: "Sun and set make sunset." },
    { say: "Make the word by yourself.", alt: [{ pic: "🧺", seq: "bas ket", extra: "mag net", trap: "bas net" }, { pic: "🧲", seq: "mag net", extra: "rab bit", trap: "mag bit" }, { pic: "🐱", seq: "kit ten", extra: "pup pet", trap: "kit pet" }] },
  ],
}));
