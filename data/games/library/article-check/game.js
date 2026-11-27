// Article Check. Skill RI.6.10-1.
// Reading and comprehending literary nonfiction in the grades 6 to 8 complexity band. Avoiding dense texts is the known slip.
Sidekick.game(Sidekick.play({
  title: "Article Check",
  emoji: "🗞️",
  premise: "A dense article rewards a careful read. Find the idea that every paragraph serves.",
  outro: "After reading, state the central idea and the facts that support it.",
  scene: "desk",
  kind: "pick",
  fs: 4.6,
  hint: "Reread. What point do all the facts add up to?",
  tag: "avoids_dense_text",
  rounds: [
    { say: "Read the article. Tap its central idea.", read: "For centuries, sailors feared scurvy more than storms. Gums bled and old wounds reopened. In 1747 a ship’s doctor gave some sick sailors oranges and lemons, and they recovered within days. Today we know the cure was vitamin C.", yes: "Fresh citrus fruit turned out to cure a deadly sailors’ disease.|", no: "Storms were dangerous for ships.|Oranges are a kind of fruit.|Sailors worked hard.", trap: "Storms were dangerous for ships.", why: "Storms are mentioned once. Most of the article is about scurvy and its cure.", win: "The whole article builds to the citrus cure." },
    { say: "Tap the two facts that support the central idea.", mark: "Ships carried salted meat.|*Sailors given oranges and lemons recovered within days.|Voyages could last months.|*The cure was later found to be vitamin C.", trap: "Voyages could last months.", why: "True, but it does not show what cured the disease.", win: "The test and the vitamin." },
    { say: "Read this article. Tap its central idea by yourself.", read: "A honeybee that finds flowers returns to the hive and dances. The angle of her waggle shows the direction, and its length shows the distance. Other bees follow these directions straight to the food.", yes: "Honeybees use a dance to tell each other where food is.|", no: "Bees can fly.|Flowers make nectar.|Hives are crowded.|Dancing is fun.|Bees have wings.", trap: "Flowers make nectar." },
  ],
}));
