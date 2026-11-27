// Can It Close?. Skill 7.G.A.2-1.
// Drawing triangles from given side measures and noticing when they cannot form a triangle. Ignoring whether the sides can meet is the known slip.
Sidekick.game(Sidekick.play({
  title: "Can It Close?",
  emoji: "🥢",
  premise: "Three sticks make a triangle only if the two shorter ones together are longer than the longest.",
  outro: "In any triangle, the two shorter sides add up to more than the longest side.",
  scene: "desk",
  kind: "sort",
  fs: 6,
  hint: "Add the two shortest sides. Is the total more than the longest?",
  tag: "ignores_triangle_inequality",
  rounds: [
    { say: "Which sets of side lengths make a triangle?", bins: "Makes a triangle|Cannot close", items: ["3, 4, 5|5, 6, 7", "3, 4, 9|2, 2, 6"], trap: ["3, 4, 9", 0], why: "3 + 4 is only 7. The short sides cannot reach across 9.", win: "The short sides must beat the long one." },
    { say: "Two sides are 3 and 4. Key in the longest whole-number third side.", kind: "type", icon: "🥢", ans: 6, trap: 7, why: "With 7 the two short sides lie flat along it. It must be less than 7.", win: "3 + 4 = 7, so the third side can be at most 6." },
    { say: "Sort these by yourself.", bins: "Makes a triangle|Cannot close", items: ["4, 6, 8|7, 7, 7|5, 9, 12", "1, 2, 5|4, 4, 10"], trap: ["4, 4, 10", 0] },
  ],
}));
