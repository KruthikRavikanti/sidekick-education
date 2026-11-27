// Title Capitals. Skill L.3.2-1.
// Capitalizing appropriate words in titles. Capitalizing every word or none is the known slip.
Sidekick.game(Sidekick.play({
  title: "Title Capitals",
  emoji: "🎩",
  premise: "In a title, the first word, the last word and all the important words get capitals. Little words like in, the and of do not.",
  outro: "Capitalize the first, last and important words of a title, not small words in the middle.",
  scene: "paper",
  kind: "pick",
  fs: 5.6,
  hint: "Is it the first word, the last word, or an important word?",
  tag: "capitalizes_every_word",
  rounds: [
    { say: "Tap every word that needs a capital in this title.", mark: "*the *cat in the *hat", trap: "in", why: "In is a small word in the middle. It stays lowercase.", win: "The Cat in the Hat." },
    { say: "Tap every word that needs a capital in this title.", mark: "*a *day at the *beach", trap: "at", why: "At is a small word in the middle. It stays lowercase.", win: "A Day at the Beach." },
    { say: "Tap the words by yourself.", alt: [{ mark: "*the *lion and the *mouse", trap: "and" }, { mark: "*tales of a *brave *knight", trap: "of" }, { mark: "*the *house on the *hill", trap: "on" }] },
  ],
}));
