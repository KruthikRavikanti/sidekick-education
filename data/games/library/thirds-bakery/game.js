// Thirds Bakery. Skill 2.G.A.3-1.
// Partitioning circles and rectangles into two, three or four equal shares: the child picks the shapes cut equally. Three unequal pieces called thirds is the known slip.
Sidekick.game(Sidekick.play({
  title: "Thirds Bakery",
  emoji: "🥧",
  premise: "Three friends want the same amount of pie. Find the shapes that are cut into shares of the same size.",
  outro: "Thirds are three shares that are all the same size.",
  scene: "kitchen",
  kind: "pick",
  cast: "",
  hint: "Count the shares, then check that they are all the same size.",
  tag: "unequal_thirds",
  rounds: [
    { say: "Tap every shape that is cut into equal shares.", yes: "~pie:0/3 ~bar:0/2 ~sqcut:q", no: "~pieU:3 ~barU:2 ~sqcut:u", trap: "~pieU:3", why: "It has 3 pieces, but they are not the same size.", win: "Equal shares all match." },
    { say: "Tap every shape cut into 3 equal shares.", yes: "~pie:0/3 ~bar:0/3 ~sqcut:t ~sqcut:w", no: "~barU:3 ~pieU:3 ~bar:0/4", trap: "~barU:3", why: "Three pieces, but one is much bigger. Those are not thirds.", win: "Three shares, all the same size." },
    { say: "Tap every shape cut into 3 equal shares.", yes: "~pie:0/3 ~sqcut:w ~bar:0/3", no: "~pieU:3 ~barU:3 ~pie:0/2 ~sqcut:q", trap: "~pieU:3" },
  ],
}));
