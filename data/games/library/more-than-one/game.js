// More Than One. Skill L.K.1-3.
// Forming regular plural nouns by adding s or es. Missing the es after x, sh and ch is the known slip.
Sidekick.game(Sidekick.play({
  title: "More Than One",
  emoji: "🐕",
  premise: "One dog, two dogs. To show more than one, add s. Some words need es.",
  outro: "Add s to mean more than one. Words that end in x, s, sh or ch add es.",
  scene: "meadow",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Say it out loud. Do you hear an extra beat, like box-es?",
  tag: "misses_es_ending",
  rounds: [
    { say: "Finish each one to show more than one.", rows: [["one dog, two ___", "dogs"], ["one box, two ___", "boxes"]], extra: "dog boxs", trap: [1, "boxs"], why: "Say it: box-es. Words that end in x add es.", win: "Dogs and boxes." },
    { say: "Finish these.", rows: [["one cat, two ___", "cats"], ["one bus, two ___", "buses"], ["one hat, two ___", "hats"]], extra: "buss", trap: [1, "buss"], why: "Say it: bus-es. It needs es.", win: "Cats, buses and hats." },
    { say: "Finish these by yourself.", rows: [["one pig, two ___", "pigs"], ["one fox, two ___", "foxes"], ["one dish, two ___", "dishes"]], extra: "foxs dishs", trap: [1, "foxs"] },
  ],
}));
