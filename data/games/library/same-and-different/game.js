// Same and Different. Skill K.G.B.4-2.
// Comparing two shapes: the child sorts facts into the same for both or different, using sides and corners instead of color or size.
Sidekick.game(Sidekick.play({
  title: "Same and Different",
  emoji: "🔍",
  premise: "Two shapes sit side by side. Sort the clues: which are true for both, and which are different?",
  outro: "Shapes can be alike in some ways and different in others. Sides and corners tell the story.",
  scene: "paper",
  kind: "sort",
  hint: "Check the clue on one shape, then on the other.",
  tag: "compares_only_looks",
  rounds: [
    { say: "Sort each clue: the same for both shapes, or different?", q: "A square and a triangle", bins: "Same for both|Different", items: ["straight sides|flat shape", "how many sides|how many corners"], trap: ["how many corners", 0], why: "A square has 4 corners. A triangle has 3. That is different.", win: "Both are flat with straight sides. The counts are different." },
    { say: "Sort the clues for these two shapes.", q: "A circle and a square", bins: "Same for both|Different", items: ["flat shape|closed shape", "has corners|has straight sides"], trap: ["has corners", 0], why: "A square has corners. A circle has none.", win: "Both are flat and closed. Only the square has corners." },
    { say: "Sort these clues by yourself.", q: "A triangle and a rectangle", bins: "Same for both|Different", items: ["straight sides|has corners|flat shape", "how many sides|how many corners"], trap: ["how many sides", 0] },
  ],
}));
