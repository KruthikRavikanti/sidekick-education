// Spelling Patterns. Skill L.2.2-4.
// Generalizing learned spelling patterns when writing words (cage to badge, boy to boil). Spelling each word without using patterns is the known slip.
Sidekick.game(Sidekick.play({
  title: "Spelling Patterns",
  emoji: "🧩",
  premise: "Spelling follows patterns. After a short vowel the j sound is dge. The oi sound is oy at the end of a word.",
  outro: "Use patterns: -ge after a long vowel, -dge after a short one; oi inside a word, oy at the end.",
  scene: "desk",
  kind: "fill",
  fs: 6.4,
  cast: "",
  hint: "Is the vowel before it short or long? Is the sound at the end of the word?",
  tag: "ignores_patterns",
  rounds: [
    { say: "Finish each word with ge or dge.", rows: [["ca___", "ge"], ["ba___", "dge"], ["pa___", "ge"], ["fu___", "dge"]], trap: [1, "ge"], why: "Badge has a short a. After a short vowel, use dge.", win: "Cage, badge, page, fudge." },
    { say: "Finish each word with oi or oy.", rows: [["b___", "oy"], ["b___l", "oi"], ["t___", "oy"], ["c___n", "oi"]], trap: [0, "oi"], why: "At the end of a word, the sound is spelled oy.", win: "Boy, boil, toy, coin." },
    { say: "Finish these by yourself.", rows: [["bri___", "dge"], ["sta___", "ge"], ["j___", "oy"], ["p___nt", "oi"]], trap: [0, "ge"] },
  ],
}));
