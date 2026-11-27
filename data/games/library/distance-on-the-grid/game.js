// Distance on the Grid. Skill 8.G.B.8-2.
// Applying the Pythagorean theorem to find the distance between two points. Forgetting to take the square root is the known slip.
Sidekick.game(Sidekick.play({
  title: "Distance on the Grid",
  emoji: "🧭",
  premise: "The distance between two points is the longest side of the right triangle between them. Square the legs, add, and take the root.",
  outro: "Distance = √(across² + up²). Do not stop before the square root.",
  scene: "paper",
  kind: "type",
  icon: "🧭",
  hint: "Legs first. Square them, add, then take the square root.",
  tag: "forgets_square_root",
  rounds: [
    { say: "Find the distance from (1, 2) to (4, 6), one step at a time.", kind: "fill", fs: 6, cast: "", rows: [["leg across", "3"], ["leg up", "4"], ["3^2 + 4^2", "25"], ["distance", "5"]], extra: "7", trap: [3, "25"], why: "25 is the distance squared. Take its square root.", win: "√25 = 5." },
    { say: "Key in the distance.", q: "From (0, 0) to (6, 8)", ans: 10, trap: 100, why: "100 is 36 + 64. The distance is its square root.", win: "√100 = 10." },
    { say: "Find the distance by yourself.", alt: [{ q: "From (1, 1) to (6, 13)", ans: 13, trap: 169 }, { q: "From (2, 3) to (10, 9)", ans: 10, trap: 100 }, { q: "From (0, 5) to (12, 0)", ans: 13, trap: 169 }] },
  ],
}));
