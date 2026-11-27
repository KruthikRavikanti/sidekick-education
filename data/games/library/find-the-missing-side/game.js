// Find the Missing Side. Skill 8.G.B.7-1.
// Applying the Pythagorean theorem to find unknown side lengths. Adding the sides, or adding when a leg is missing, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Find the Missing Side",
  emoji: "🪜",
  premise: "With two sides of a right triangle you can find the third. Add the squares to find the longest side. Subtract to find a leg.",
  outro: "c² = a² + b². For a missing leg, subtract: a² = c² − b². Then take the square root.",
  scene: "city",
  kind: "type",
  hint: "Square the sides you know. Add for the longest side, subtract for a leg. Then take the root.",
  tag: "adds_sides",
  rounds: [
    { say: "Key in the longest side.", fig: { type: "poly", pts: [[18, 86], [86, 86], [18, 24]], sides: ["8", "?", "6"], right: 0, v: [] }, ans: 10, trap: 14, why: "That adds the sides. Add their squares: 36 + 64 = 100, then take the root.", win: "√100 = 10." },
    { say: "This time a leg is missing. Key it in.", fig: { type: "poly", pts: [[18, 86], [86, 86], [18, 24]], sides: ["5", "13", "?"], right: 0, v: [] }, ans: 12, trap: 8, why: "That subtracts the sides. Subtract the squares: 169 − 25 = 144.", win: "√144 = 12." },
    { say: "Find the missing side by yourself.", alt: [{ fig: { type: "poly", pts: [[18, 86], [86, 86], [18, 24]], sides: ["12", "?", "9"], right: 0, v: [] }, ans: 15, trap: 21 }, { fig: { type: "poly", pts: [[18, 86], [86, 86], [18, 24]], sides: ["6", "10", "?"], right: 0, v: [] }, ans: 8, trap: 4 }, { fig: { type: "poly", pts: [[18, 86], [86, 86], [18, 24]], sides: ["12", "?", "5"], right: 0, v: [] }, ans: 13, trap: 17 }] },
  ],
}));
