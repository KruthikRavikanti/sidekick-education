// Big and Small Shapes. Skill K.G.A.2-1.
// A shape keeps its name at any size: big and tiny versions of the same shape go in one bin, so the child sorts by sides and corners, not size.
Sidekick.game(Sidekick.play({
  title: "Big and Small Shapes",
  emoji: "🔺",
  premise: "Some shapes are huge and some are tiny. Sort them by their name, no matter how big they are.",
  outro: "A tiny triangle is still a triangle. Size does not change the name.",
  scene: "sky",
  kind: "sort",
  fs: 7,
  cast: "",
  hint: "Count the sides. The size does not matter.",
  tag: "tiny_shape_is_not_that_shape",
  rounds: [
    { say: "Sort the shapes by name. Size does not matter.", bins: "Triangle|Square|Circle", items: ["▲ ▴", "■ ▪", "● •"], trap: ["▴", 1], why: "It is tiny, but count: three sides. It is still a triangle.", win: "Big or tiny, the name stays." },
    { say: "Look closely at the small ones.", bins: "Triangle|Circle", items: ["▲ ▴ △", "● • ○"], trap: ["▴", 1], why: "Three sides and three corners make a triangle at any size.", win: "Every triangle found." },
    { say: "Sort all of these by yourself.", bins: "Triangle|Square|Circle", items: ["▲ ▴ △", "■ ▪ □", "● •"], trap: ["▪", 2] },
  ],
}));
