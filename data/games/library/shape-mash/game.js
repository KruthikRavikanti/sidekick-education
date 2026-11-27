// Shape Mash. Skill K.G.B.6-1.
// Composing shapes: two triangles make a square and two squares make a rectangle. The child matches each pair to the shape it forms.
Sidekick.game(Sidekick.play({
  title: "Shape Mash",
  emoji: "🧩",
  premise: "Push two shapes together and a new shape appears. Match each pair to the shape it makes.",
  outro: "Small shapes can join to make new shapes.",
  scene: "candy",
  kind: "fill",
  fs: 7,
  cast: "",
  hint: "Picture sliding the two shapes together until their sides touch.",
  tag: "cannot_see_joined_shape",
  rounds: [
    { say: "Drag the shape each pair makes.", rows: [["◣ + ◥", "■"], ["■ + ■", "▬"]], extra: "▲", trap: [0, "▲"], why: "Slide the two triangles together. They make a square.", win: "Two triangles make a square. Two squares make a rectangle." },
    { say: "More pairs to push together.", rows: [["◢ + ◣", "▲"], ["◣ + ◥", "■"], ["▲ + ▼", "◆"]], extra: "●", trap: [0, "■"], why: "These two lean together into one big triangle.", win: "You saw every new shape." },
    { say: "Match these pairs by yourself.", rows: [["■ + ■", "▬"], ["◢ + ◣", "▲"], ["◥ + ◣", "■"]], extra: "● ◆", trap: [2, "▲"] },
  ],
}));
