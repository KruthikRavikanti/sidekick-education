// Work Back to the Side. Skill 4.MD.A.3-2.
// Finding an unknown side of a rectangle from its area or perimeter. Using the other formula (subtracting for area, or forgetting to halve for perimeter) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Work Back to the Side",
  emoji: "🚪",
  premise: "You know the area or the distance around, and one side. Work backward to find the side that is missing.",
  outro: "Area ÷ one side gives the other side. For perimeter, take away both known sides, then halve.",
  scene: "paper",
  kind: "type",
  hint: "Area is length × width. Perimeter is all four sides added.",
  tag: "uses_the_other_formula",
  rounds: [
    { say: "The area is 48 square feet. Key in the missing side.", fig: { type: "rect", d: [8, 6], l: ["8 ft", "?"] }, ans: 6, trap: 40, why: "Area is length × width. What times 8 makes 48?", win: "48 ÷ 8 = 6 feet." },
    { say: "The perimeter is 30 feet. Key in the missing side.", fig: { type: "rect", d: [9, 6], l: ["9 ft", "?"] }, ans: 6, trap: 12, trap2: 21, why: "12 is both missing sides together. Split it in half.", why2: "There are two sides of 9. Take away 18, then halve what is left.", win: "30 − 18 = 12, and half of 12 is 6 feet." },
    { say: "Find the missing side by yourself.", alt: [{ say: "The area is 56 square meters. Key in the missing side.", fig: { type: "rect", d: [8, 7], l: ["?", "7 m"] }, ans: 8, trap: 49 }, { say: "The perimeter is 26 meters. Key in the missing side.", fig: { type: "rect", d: [8, 5], l: ["8 m", "?"] }, ans: 5, trap: 10 }] },
  ],
}));
