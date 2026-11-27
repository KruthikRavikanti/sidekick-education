// Boat in a Current. Skill N-VM.A.3-1.
// Solving problems involving velocity and other quantities represented by vectors. Adding the magnitudes in place of the vectors is the known slip.
Sidekick.game(Sidekick.play({
  title: "Boat in a Current",
  emoji: "⛵",
  premise: "A boat heads east while the current pushes north. Its real path is the diagonal, and its real speed is the length of that diagonal.",
  outro: "Velocities and forces add as vectors. At right angles, the size of the sum is √(a^2 + b^2).",
  scene: "ocean",
  kind: "type",
  icon: "⛵",
  hint: "The two speeds are legs of a right triangle. The true speed is the hypotenuse.",
  tag: "adds_magnitudes",
  rounds: [
    { say: "A boat heads east at 4 m/s. The current pushes north at 3 m/s. Key in the boat’s actual speed.", fig: { type: "poly", pts: [[12, 86], [88, 86], [88, 26]], sides: ["4", "3", "?"], right: 1, v: [], h: 34 }, ans: 5, trap: 7, why: "The pushes are at right angles, so they do not simply add. Use √(16 + 9).", win: "√25 = 5 m/s." },
    { say: "A plane flies east at 12 km per minute. Wind pushes it north at 5. Key in its actual speed.", q: "√(144 + 25)", ans: 13, trap: 17, why: "East and north are different directions. The sum is a diagonal.", win: "√169 = 13." },
    { say: "Find the actual speed by yourself.", alt: [{ q: "A swimmer goes 6 m/s across a river while the current carries her 8 m/s downstream.", ans: 10, trap: 14 }, { q: "A drone flies north at 8 m/s in a wind blowing east at 15 m/s.", ans: 17, trap: 23 }, { q: "A ball rolls east at 9 m/s on a cart moving north at 12 m/s.", ans: 15, trap: 21 }] },
  ],
}));
