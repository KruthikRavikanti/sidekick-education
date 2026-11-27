// Quadrant Sorter. Skill 6.NS.C.6-2.
// Understanding signs of numbers in ordered pairs as indicating locations in quadrants. Mixing up the quadrant numbers is the known slip.
Sidekick.game(Sidekick.play({
  title: "Quadrant Sorter",
  emoji: "🧭",
  premise: "The signs of a point tell which quarter of the plane it is in. Count the quadrants from the upper right, going left around.",
  outro: "Quadrant I is (+, +), II is (−, +), III is (−, −) and IV is (+, −).",
  scene: "paper",
  kind: "sort",
  fs: 5.4,
  hint: "Is x left or right? Is y up or down? Start at upper right and go counterclockwise.",
  tag: "mixes_up_quadrants",
  rounds: [
    { say: "Which quadrant is each point in?", bins: "I|II|III|IV", items: ["(3, 2)|", "(−2, 5)|", "(−4, −1)|", "(6, −3)|"], trap: ["(−2, 5)", 3], why: "x is negative, so it is on the left. y is positive, so it is up. That is quadrant II.", win: "One point in each quadrant." },
    { say: "Sort these points.", bins: "I|II|III|IV", items: ["(1, 7)|", "(−6, 2)|", "(−3, −3)|", "(4, −8)|"], trap: ["(4, −8)", 1], why: "x is positive and y is negative: right and down. That is quadrant IV.", win: "Signs tell the quadrant." },
    { say: "Sort these by yourself.", bins: "I|II|III|IV", items: ["(5, 5)|", "(−1, 9)|", "(−7, −2)|", "(2, −6)|"], trap: ["(−1, 9)", 3] },
  ],
}));
