// Equal Area Parts. Skill 3.G.A.2-1.
// Partitioning shapes into parts with equal areas: triangles from the diagonals of a square are equal parts, while unequal cuts are not.
Sidekick.game(Sidekick.play({
  title: "Equal Area Parts",
  emoji: "🟧",
  premise: "A shape can be cut into parts that cover the same amount. Sort the cuts that are fair from the ones that are not.",
  outro: "Equal parts cover the same amount of the shape.",
  scene: "candy",
  kind: "sort",
  cast: "",
  hint: "Would each part cover the same amount if you laid them on top of each other?",
  tag: "accepts_unequal_parts",
  rounds: [
    { say: "Is the shape cut into parts of equal area?", bins: "Equal parts|Not equal parts", items: ["~sqcut:x ~sqcut:q ~sqcut:t ~pie:0/8", "~sqcut:u ~barU:4 ~pieU:3"], trap: ["~sqcut:x", 1], why: "The diagonals cut the square into 4 triangles of the same size.", win: "Equal parts can be triangles." },
    { say: "Check these cuts.", bins: "Equal parts|Not equal parts", items: ["~sqcut:d ~sqcut:w ~pie:0/6 ~bar:0/8", "~barU:3 ~pieU:2 ~sqcut:u"], trap: ["~sqcut:d", 1], why: "The diagonal cuts the square into 2 triangles of the same size.", win: "Every equal cut found." },
    { say: "Sort these by yourself.", bins: "Equal parts|Not equal parts", items: ["~sqcut:x ~sqcut:h ~pie:0/3 ~bar:0/6", "~barU:2 ~pieU:4 ~barU:4"], trap: ["~sqcut:x", 1] },
  ],
}));
