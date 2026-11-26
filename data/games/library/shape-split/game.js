// Shape Split. Skill 1.G.A.2-1.
// Composing two-dimensional shapes: the child sees which two smaller shapes make a larger one, such as two squares in a rectangle.
Sidekick.game(Sidekick.play({
  title: "Shape Split",
  emoji: "✂️",
  premise: "Big shapes are hiding smaller shapes inside them. Match each big shape to the two pieces that make it.",
  outro: "A bigger shape can be made from smaller shapes.",
  scene: "paper",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Picture a line cutting the big shape in two. What are the pieces?",
  tag: "cannot_see_inner_shapes",
  rounds: [
    { say: "Which two pieces make each big shape?", rows: [["▬", "■ + ■"], ["◆", "▲ + ▼"]], extra: "● + ●|", trap: [0, "▲ + ▼"], why: "Cut the long rectangle in the middle. You get two squares.", win: "Two squares, and two triangles." },
    { say: "Three big shapes now.", rows: [["▬", "■ + ■"], ["◆", "▲ + ▼"], ["⌂", "■ + ▲"]], trap: [2, "■ + ■"], why: "The house shape has a pointed roof: a square with a triangle on it.", win: "You found the hidden pieces." },
    { say: "Match these by yourself.", rows: [["⌂", "■ + ▲"], ["▬", "■ + ■"], ["◆", "▲ + ▼"]], extra: "▲ + ▲|", trap: [0, "■ + ■"] },
  ],
}));
