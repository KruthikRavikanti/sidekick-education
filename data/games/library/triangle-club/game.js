// Triangle Club. Skill 1.G.A.1-1.
// Defining attributes: a triangle is closed with three straight sides, whatever its size or turn. Tiny or tipped shapes test whether the child uses the rule.
Sidekick.game(Sidekick.play({
  title: "Triangle Club",
  emoji: "⛰️",
  premise: "Only true members get into the club. Size and the way a shape is turned do not matter: the sides do.",
  outro: "A shape is named by its sides and corners, not by its size or which way it is turned.",
  scene: "sky",
  kind: "sort",
  cast: "",
  hint: "Is it closed? Count the straight sides.",
  tag: "judges_by_size_or_turn",
  rounds: [
    { say: "Which shapes are triangles? Sort them all.", bins: "Triangle|Not a triangle", items: ["~tri:e ~tri:o ~tri:t", "~quad:sq ~open:3 ~circle"], trap: ["~tri:t", 1], why: "It is small, but it is closed with 3 straight sides.", win: "Closed, with 3 straight sides." },
    { say: "Now the rectangle club. Four sides and four square corners.", bins: "Rectangle|Not a rectangle", items: ["~quad:rect ~quad:tall", "~quad:trap ~tri:r ~oval"], trap: ["~quad:tall", 1], why: "Standing a rectangle on its end does not change it.", win: "Turned or not, it is a rectangle." },
    { say: "Sort these by yourself.", bins: "Triangle|Not a triangle", items: ["~tri:r ~tri:s ~tri:i", "~quad:trap ~open:3 ~curvy"], trap: ["~open:3", 0] },
  ],
}));
