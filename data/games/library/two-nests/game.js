// Two Nests. Skill K.OA.A.3-1.
// Splitting a number into two parts: the child shares a fixed pile between two nests, so the two parts are seen to make the whole. Leaving acorns out breaks the split.
Sidekick.game(Sidekick.play({
  title: "Two Nests",
  emoji: "🐿️",
  premise: "The squirrel hides its acorns in two nests. Share them out so every acorn has a home.",
  outro: "A number can be split into two parts, and the parts make the whole.",
  scene: "forest",
  kind: "build",
  cast: "🐿️ 🌳 🍂 🌳",
  hint: "Every acorn needs a nest. The two nests together hold them all.",
  tag: "leaves_part_out",
  pile: [["🌰", 1, 5]],
  plates: "Nest 1|Nest 2",
  rounds: [
    { say: "Share all 5 acorns. Put 3 in Nest 1 and the rest in Nest 2.", goal: [3, 2], trap: [3, 0], why: "Some acorns are still waiting. All 5 need a nest.", win: "5 is 3 and 2." },
    { say: "Split the 5 acorns a new way. Put 1 in Nest 1 and the rest in Nest 2.", goal: [1, 4], trap: [1, 0], why: "Some acorns are still waiting. All 5 need a nest.", win: "5 is also 1 and 4." },
    { say: "Share the acorns by yourself.", alt: [{ say: "Share all 6 acorns. Put 2 in Nest 1 and the rest in Nest 2.", pile: [["🌰", 1, 6]], goal: [2, 4], trap: [2, 0] }, { say: "Share all 6 acorns. Put 5 in Nest 1 and the rest in Nest 2.", pile: [["🌰", 1, 6]], goal: [5, 1], trap: [5, 0] }, { say: "Share all 7 acorns. Put 3 in Nest 1 and the rest in Nest 2.", pile: [["🌰", 1, 7]], goal: [3, 4], trap: [3, 0] }] },
  ],
}));
