// Fraction Garden Plot. Skill 5.NF.B.4-3.
// Finding the area of a rectangle with fractional side lengths by tiling and by multiplying: 1/2 × 3/4 = 3/8. Adding the side lengths is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fraction Garden Plot",
  emoji: "🌱",
  premise: "A garden plot can be less than one foot on each side. Its area is still length times width.",
  outro: "Area is length × width, even when both sides are fractions.",
  scene: "meadow",
  kind: "type",
  icon: "🌱",
  hint: "Area covers space. Multiply the two sides.",
  tag: "adds_the_sides",
  rounds: [
    { say: "The big square is 1 foot on each side. Paint a plot {3/4} foot wide and {1/2} foot tall.", kind: "paint", cast: "", grid: [4, 2], rect: [3, 1], strict: true, noun: "Eighths painted", trap: [4, 1], why: "That is the full width. The plot is only 3 of the 4 columns wide.", win: "The plot covers 3 of the 8 parts: 3 eighths of a square foot." },
    { say: "Key in the area as a fraction.", q: "A plot is {2/3} yard long and {1/5} yard wide. What is its area in square yards?", ans: "2/15", trap: "13/15", why: "That adds the sides. Area is length times width.", win: "2 × 1 on top, 3 × 5 on the bottom." },
    { say: "Find the area by yourself.", alt: [{ q: "A tile is {3/4} foot long and {3/5} foot wide. What is its area in square feet?", ans: "9/20", trap: "27/20" }, { q: "A card is {1/3} foot wide and {5/6} foot long. What is its area in square feet?", ans: "5/18", trap: "7/6" }] },
  ],
}));
