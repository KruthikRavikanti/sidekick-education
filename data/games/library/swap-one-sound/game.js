// Swap One Sound. Skill RF.K.2-5.
// Adding or substituting individual sounds in one-syllable words to make new words: cat becomes bat. Changing the whole word is the known slip.
Sidekick.game(Sidekick.play({
  title: "Swap One Sound",
  emoji: "🔁",
  premise: "Change just one sound and you get a brand new word. Swap the first letter to match the new picture.",
  outro: "Changing one sound in a word makes a new word.",
  scene: "candy",
  kind: "row",
  fs: 8,
  hint: "Keep the end of the word. Change only the first sound.",
  tag: "changes_whole_word",
  rounds: [
    { say: "This says cat. Change one letter to make the new picture.", pic: "🐱 ➜ 🦇", seq: "b a t", extra: "c", trap: "c a t", why: "That still says cat. Swap the first letter for b.", win: "Cat became bat." },
    { say: "This says pen. Change one letter to make the new picture.", pic: "🖊️ ➜ 🐔", seq: "h e n", extra: "p", trap: "p e n", why: "That still says pen. Swap the first letter for h.", win: "Pen became hen." },
    { say: "Change one letter by yourself.", alt: [{ say: "This says bug. Change one letter to make the new picture.", pic: "🐛 ➜ ☕", seq: "m u g", extra: "b", trap: "b u g" }, { say: "This says log. Change one letter to make the new picture.", pic: "🪵 ➜ 🐶", seq: "d o g", extra: "l", trap: "l o g" }] },
  ],
}));
