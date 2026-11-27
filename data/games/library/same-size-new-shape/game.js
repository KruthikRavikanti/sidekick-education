// Same Size, New Shape. Skill 2.G.A.3-4.
// Equal shares of identical wholes need not have the same shape: a triangle half and a rectangle half of the same square are both halves.
Sidekick.game(Sidekick.play({
  title: "Same Size, New Shape",
  emoji: "🪄",
  premise: "A square can be cut in half in more than one way. The halves look different but are still the same amount.",
  outro: "Equal shares of the same whole do not have to be the same shape.",
  scene: "candy",
  kind: "sort",
  cast: "",
  hint: "Is the shaded part exactly one of two equal shares? Its shape does not matter.",
  tag: "equal_shares_must_look_alike",
  rounds: [
    { say: "Is the shaded part half of the square?", bins: "Half|Not half", items: ["~sqcut:v:1 ~sqcut:h:1 ~sqcut:d:1", "~sqcut:u:1 ~sqcut:q:1 ~sqcut:t:1"], trap: ["~sqcut:d:1", 1], why: "The triangle is exactly half of the square, just like the rectangle half.", win: "Halves can be triangles or rectangles." },
    { say: "Is the shaded part a fourth of the square?", bins: "A fourth|Not a fourth", items: ["~sqcut:q:1 ~sqcut:x:1", "~sqcut:v:1 ~sqcut:t:1 ~sqcut:w:1"], trap: ["~sqcut:x:1", 1], why: "The square is cut into 4 equal triangles. One is a fourth.", win: "Fourths can be squares or triangles." },
    { say: "Sort these by yourself.", bins: "Half|Not half", items: ["~sqcut:d:1 ~sqcut:h:1 ~sqcut:q:2 ~sqcut:x:2", "~sqcut:u:1 ~sqcut:t:1 ~sqcut:q:1"], trap: ["~sqcut:x:2", 1] },
  ],
}));
