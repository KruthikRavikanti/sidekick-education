// Fence It In. Skill 3.MD.D.8-1.
// Finding perimeter by adding side lengths. Multiplying the sides to get the area, or adding only two sides, are the known slips.
Sidekick.game(Sidekick.play({
  title: "Fence It In",
  emoji: "🐄",
  premise: "The cows need a fence all the way around their field. Add up every side to find how much fence to buy.",
  outro: "Perimeter is the distance all the way around: add all the sides.",
  scene: "field",
  kind: "type",
  icon: "🐄",
  hint: "Walk all the way around. A rectangle has four sides to add.",
  tag: "finds_the_area",
  tag2: "adds_only_two_sides",
  rounds: [
    { say: "Key in the distance around, in centimeters.", fig: { type: "rect", d: [6, 4], l: ["6 cm", "4 cm"] }, ans: 20, trap: 24, trap2: 10, why: "That is the space inside. Add the four sides instead.", why2: "That is only two sides. A rectangle has four.", win: "6 + 4 + 6 + 4 = 20 cm." },
    { say: "Key in the distance around, in meters.", fig: { type: "rect", d: [7, 3], l: ["7 m", "3 m"] }, ans: 20, trap: 21, trap2: 10, why: "That is the space inside. Add the four sides instead.", win: "7 + 3 + 7 + 3 = 20 m." },
    { say: "Find the distance around by yourself.", alt: [{ fig: { type: "rect", d: [8, 5], l: ["8 m", "5 m"] }, ans: 26, trap: 40, trap2: 13 }, { fig: { type: "rect", d: [9, 2], l: ["9 cm", "2 cm"] }, ans: 22, trap: 18, trap2: 11 }] },
  ],
}));
