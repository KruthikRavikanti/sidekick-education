// Describing Word Hunt. Skill L.1.1-6.
// Using frequently occurring adjectives: the describing words in a sentence are identified. Using few describing words is the known slip.
Sidekick.game(Sidekick.play({
  title: "Describing Word Hunt",
  emoji: "🎨",
  premise: "Describing words tell what kind: big, red, soft, tiny. They paint a picture in your mind.",
  outro: "An adjective describes a noun: what kind, what color, what size.",
  scene: "candy",
  kind: "pick",
  fs: 5.6,
  hint: "Which words tell what KIND of thing it is?",
  tag: "misses_adjectives",
  rounds: [
    { say: "Tap the describing words.", mark: "The *big dog chased a *red ball.", trap: "dog", why: "Dog is the thing. Which word tells what kind of dog?", win: "Big and red describe." },
    { say: "Tap the describing words.", mark: "A *tiny bug sat on the *soft bed.", trap: "bug", why: "Bug is the thing. Tiny tells what kind of bug.", win: "Tiny and soft describe." },
    { say: "Tap the describing words by yourself.", alt: [{ mark: "The *cold wind blew my *little kite.", trap: "wind" }, { mark: "We ate *sweet plums under a *tall tree.", trap: "plums" }, { mark: "A *sleepy cat sat on the *warm rug.", trap: "cat" }] },
  ],
}));
