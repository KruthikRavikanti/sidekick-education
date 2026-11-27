// Will It Fold?. Skill 6.G.A.4-1.
// Representing three-dimensional figures using nets. Accepting nets that cannot fold into the solid is the known slip.
Sidekick.game(Sidekick.play({
  title: "Will It Fold?",
  emoji: "🎲",
  premise: "A net is a flat pattern that folds into a solid. A cube needs six squares, but not every six-square pattern folds up.",
  outro: "A net must fold so every face ends up in its own place with no overlaps.",
  scene: "candy",
  kind: "sort",
  figW: 15,
  hint: "Imagine folding it. Do two squares land on the same face?",
  tag: "accepts_bad_net",
  rounds: [
    { say: "Which patterns fold into a cube?", bins: "Folds into a cube|Does not", items: ["~cells:1,0;0,1;1,1;2,1;1,2;1,3 ~cells:0,0;1,0;2,0;1,1;1,2;1,3", "~cells:0,0;1,0;2,0;3,0;4,0;5,0"], trap: ["~cells:0,0;1,0;2,0;3,0;4,0;5,0", 0], why: "Six in a row wraps around and overlaps. No squares are left for the two ends.", win: "The cross and the T both close up." },
    { say: "Sort these patterns.", bins: "Folds into a cube|Does not", items: ["~cells:0,0;1,0;1,1;2,1;2,2;3,2 ~cells:0,0;0,1;0,2;1,2;1,3;1,4", "~cells:0,0;1,0;2,0;0,1;1,1;2,1 ~cells:0,0;1,0;2,0;3,0;4,0;0,1"], trap: ["~cells:0,0;1,0;2,0;0,1;1,1;2,1", 0], why: "Four squares around one corner cannot fold up. Squares would land on each other.", win: "The stair shapes fold. The block and the long strip do not." },
    { say: "Sort these by yourself.", bins: "Folds into a cube|Does not", items: ["~cells:1,0;0,1;1,1;2,1;3,1;1,2 ~cells:1,0;0,1;1,1;2,1;1,2;1,3", "~cells:0,0;1,0;2,0;3,0;4,0;5,0 ~cells:0,0;1,0;0,1;1,1;2,1;3,1"], trap: ["~cells:0,0;1,0;2,0;3,0;4,0;5,0", 0] },
  ],
}));
