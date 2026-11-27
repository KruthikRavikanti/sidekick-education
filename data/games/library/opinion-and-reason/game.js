// Opinion and Reason. Skill W.1.1-1.
// Writing opinion pieces that state an opinion and supply a reason. Giving an opinion without a reason is the known slip.
Sidekick.game(Sidekick.play({
  title: "Opinion and Reason",
  emoji: "🐕",
  premise: "An opinion says what you think. A reason says why. Good opinion writing has both.",
  outro: "State your opinion, then give a reason for it.",
  scene: "meadow",
  kind: "fill",
  cast: "",
  hint: "The opinion tells what you think. The reason tells why.",
  tag: "opinion_without_reason",
  rounds: [
    { say: "Which sentence is the opinion? Which is the reason?", rows: [["Opinion", "Dogs are the best pet."], ["Reason", "They play fetch with you."]], extra: "I have a bike.|", trap: [1, "I have a bike."], why: "A bike does not tell why dogs are the best pet.", win: "An opinion, and a reason for it." },
    { say: "Sort this opinion and its reason.", rows: [["Opinion", "Summer is the best season."], ["Reason", "You can swim outside."]], extra: "Summer comes after spring.|", trap: [1, "Summer comes after spring."], why: "That is a fact about summer. It does not say why summer is best.", win: "Summer is best because you can swim." },
    { say: "Sort these by yourself.", rows: [["Opinion", "Apples are a great snack."], ["Reason", "They are sweet and crunchy."]], extra: "Apples grow on trees.|I am six.", trap: [1, "Apples grow on trees."] },
  ],
}));
