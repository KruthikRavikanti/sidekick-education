// Key Finder. Skill W.K.6-1.
// Exploring digital tools to produce writing: the child finds letter keys in order to type a word and learns what the space and delete keys do.
Sidekick.game(Sidekick.play({
  title: "Key Finder",
  emoji: "⌨️",
  premise: "Writers can type their words with keys. Find each letter key, in order, to type the word.",
  outro: "To type a word, press its letters in order from first to last.",
  scene: "desk",
  kind: "row",
  fs: 8,
  hint: "Say the word. Which letter comes first?",
  tag: "does_not_explore_tools",
  rounds: [
    { say: "Type the word for the picture. Press the keys in order.", pic: "🐱", seq: "c a t", extra: "z q", trap: "t a c", why: "Type from the first letter to the last: c, a, t.", win: "You typed cat." },
    { say: "What does each key do?", kind: "fill", fs: 4.6, cast: "", rows: [["makes room between words", "space bar"], ["takes away a letter", "delete key"], ["makes a big letter", "shift key"]], trap: [0, "delete key"], why: "Delete takes letters away. The space bar makes the room between words.", win: "Space, delete and shift." },
    { say: "Type the word for the picture by yourself.", alt: [{ pic: "🐶", seq: "d o g", extra: "x k", trap: "g o d" }, { pic: "☀️", seq: "s u n", extra: "w j", trap: "n u s" }, { pic: "🐷", seq: "p i g", extra: "v y", trap: "g i p" }] },
  ],
}));
