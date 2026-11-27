// Name That Share. Skill 2.G.A.3-2.
// Describing shares with the words half, third and fourth: one share is shaded and named. Calling a third three is the known slip.
Sidekick.game(Sidekick.play({
  title: "Name That Share",
  emoji: "🥮",
  premise: "One share of each cake is shaded. Give the shaded share its proper name.",
  outro: "One of 2 equal shares is a half. One of 3 is a third. One of 4 is a fourth.",
  scene: "candy",
  kind: "fill",
  cast: "",
  hint: "Count all the equal shares. That tells you the name of one share.",
  tag: "third_means_three",
  rounds: [
    { say: "Drag the name of the shaded share under each cake.", rows: [["~bar:1/2", "a half"], ["~bar:1/3", "a third"]], extra: "three|", trap: [1, "three"], why: "The cake has 3 equal shares. One of them is a third.", win: "A half and a third." },
    { say: "Three cakes to name.", rows: [["~pie:1/3", "a third"], ["~pie:1/2", "a half"], ["~pie:1/4", "a fourth"]], extra: "three|", trap: [0, "three"], why: "Three shares in all, so one share is a third.", win: "A third, a half and a fourth." },
    { say: "Name the shares by yourself.", rows: [["~sqcut:w:1", "a third"], ["~sqcut:q:1", "a fourth"], ["~sqcut:d:1", "a half"]], extra: "three|a whole", trap: [0, "three"] },
  ],
}));
