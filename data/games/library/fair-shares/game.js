// Fair Shares. Skill 1.G.A.3-1.
// Partitioning circles and rectangles into two and four equal shares: the child picks shapes cut into equal parts. Unequal pieces with the right count are the known slip.
Sidekick.game(Sidekick.play({
  title: "Fair Shares",
  emoji: "🍕",
  premise: "Friends want to share fairly. Find the shapes that are cut into shares of exactly the same size.",
  outro: "Equal shares are all the same size.",
  scene: "kitchen",
  kind: "pick",
  cast: "",
  hint: "Would every friend be happy? Each share must be the same size.",
  tag: "accepts_unequal_shares",
  rounds: [
    { say: "Tap every shape that is cut into equal shares.", yes: "~pie:0/2 ~bar:0/4 ~pie:0/4", no: "~pieU:2 ~barU:4 ~barU:2", trap: "~pieU:2", why: "The two pieces are not the same size. Equal shares match.", win: "Every share matches." },
    { say: "Tap every shape cut into 4 equal shares.", yes: "~pie:0/4 ~bar:0/4 ~sq4:0/4", no: "~pieU:4 ~barU:4 ~pie:0/2 ~bar:0/3", trap: "~barU:4", why: "It has 4 pieces, but they are not the same size.", win: "Four shares, all the same size." },
    { say: "Tap every shape cut into 2 equal shares.", yes: "~pie:0/2 ~bar:0/2", no: "~pieU:2 ~barU:2 ~pie:0/4 ~bar:0/3", trap: "~barU:2" },
  ],
}));
