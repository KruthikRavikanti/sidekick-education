// Through the Narrator. Skill RL.6.6-1.
// Explaining how an author develops the point of view of the narrator. Identifying only first or third person is the known slip.
Sidekick.game(Sidekick.play({
  title: "Through the Narrator",
  emoji: "👓",
  premise: "A narrator does not just report. Word choices reveal how the narrator feels about people and places.",
  outro: "Authors develop a narrator’s point of view through the words the narrator chooses.",
  scene: "city",
  kind: "pick",
  fs: 5.6,
  hint: "Which words show an opinion or a feeling, not just a fact?",
  tag: "first_or_third_only",
  rounds: [
    { say: "The narrator dislikes the town. Tap the four words that show it.", mark: "Our *dull little town had one *sagging store and a *tired clock that always ran *late.", trap: "store", why: "Store is a fact. Sagging shows what the narrator thinks of it.", win: "Dull, sagging, tired, late." },
    { say: "The narrator loves the sea. Tap the four words that show it.", mark: "The *glorious sea *sang to me each morning, and its *sparkling waves felt like *home.", trap: "morning,", why: "Morning tells when. The feeling is in words like glorious.", win: "Glorious, sang, sparkling, home." },
    { say: "The narrator fears the cellar. Tap the four words by yourself.", mark: "The cellar *swallowed the light, and its *icy air *clawed at my neck like a *warning.", trap: "neck" },
  ],
}));
