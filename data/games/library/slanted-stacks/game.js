// Slanted Stacks. Skill G-GMD.A.1-2.
// Giving an informal argument using Cavalieri’s principle for volume formulas. Thinking slanting changes the volume is the known slip.
Sidekick.game(Sidekick.play({
  title: "Slanted Stacks",
  emoji: "🪙",
  premise: "Push a straight stack of coins into a leaning one. Every coin is still there, so the volume is unchanged.",
  outro: "Cavalieri’s principle: solids with equal heights and equal cross sections at every level have equal volumes.",
  scene: "desk",
  kind: "sort",
  fs: 4.8,
  hint: "Are the slices the same size at every height? Is the height the same?",
  tag: "slanting_changes_volume",
  rounds: [
    { say: "Does the volume stay the same or change?", bins: "Same volume|Different volume", items: ["A coin stack pushed into a slant|A deck of cards fanned sideways", "A coin stack with 3 coins removed|A cylinder that is twice as tall"], trap: ["A coin stack pushed into a slant", 1], why: "No coin was added or removed. Same slices, same height.", win: "Leaning does not change volume." },
    { say: "A slanted cylinder has base area 10 and height 6, measured straight up. Key in its volume.", kind: "type", icon: "🪙", ans: 60, trap: 70, why: "Use the straight-up height, 6. Volume is base area × height.", win: "10 × 6 = 60, the same as an upright one." },
    { say: "Sort these by yourself.", bins: "Same volume|Different volume", items: ["Two prisms with equal slices at every level and equal heights|A leaning tower of identical books and a straight one", "Two cones with the same base but different heights|A stack with wider coins"], trap: ["A leaning tower of identical books and a straight one", 1] },
  ],
}));
