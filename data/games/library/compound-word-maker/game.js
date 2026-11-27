// Compound Word Maker. Skill L.2.4-4.
// Using knowledge of the meaning of individual words to predict the meaning of compound words. Treating compound words as unknown is the known slip.
Sidekick.game(Sidekick.play({
  title: "Compound Word Maker",
  emoji: "🏠",
  premise: "Two small words can join to make one new word. A house for a bird is a birdhouse.",
  outro: "The two small words in a compound word are clues to what it means.",
  scene: "forest",
  kind: "row",
  fs: 7,
  hint: "Read the clue. Which two small words name it?",
  tag: "treats_compound_as_unknown",
  rounds: [
    { say: "Join two words to make the word that means a house for a bird.", seq: "bird house", extra: "dog boat", trap: "dog house", why: "That is a house for a dog. The clue says bird.", win: "Bird and house make birdhouse." },
    { say: "Make the word that means a coat for the rain.", seq: "rain coat", extra: "snow bow", trap: "rain bow", why: "A rainbow is in the sky. The clue says a coat.", win: "Rain and coat make raincoat." },
    { say: "Make the word by yourself.", alt: [{ say: "Make the word that means a brush for your teeth.", seq: "tooth brush", extra: "hair paste", trap: "hair brush" }, { say: "Make the word that means a ball you kick with your foot.", seq: "foot ball", extra: "base print", trap: "base ball" }, { say: "Make the word that means light from the sun.", seq: "sun light", extra: "moon set", trap: "moon light" }] },
  ],
}));
