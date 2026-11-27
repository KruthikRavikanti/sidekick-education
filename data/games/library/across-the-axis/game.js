// Across the Axis. Skill 6.NS.C.8-2.
// Using coordinates and absolute value to find distances between points with the same first or second coordinate. Subtracting without accounting for crossing 0 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Across the Axis",
  emoji: "↔️",
  premise: "When two points share a coordinate, the distance between them is a straight count, even across an axis.",
  outro: "Distance across an axis adds the two distances from 0: from −4 to 2 is 4 + 2 = 6.",
  scene: "paper",
  kind: "type",
  icon: "↔️",
  hint: "How far is each point from the axis between them? Add the two.",
  tag: "subtracts_across_zero",
  rounds: [
    { say: "Key in the distance between the two points.", q: "From (−4, 3) to (2, 3)", ans: 6, trap: 2, why: "They are on opposite sides of 0. It is 4 to reach 0, then 2 more.", win: "4 + 2 = 6 units." },
    { say: "Key in the distance.", q: "From (1, −5) to (1, 3)", ans: 8, trap: 2, why: "From −5 up to 0 is 5, then 3 more.", win: "5 + 3 = 8 units." },
    { say: "Key in the distance by yourself.", alt: [{ q: "From (−6, 2) to (3, 2)", ans: 9, trap: 3 }, { q: "From (4, −7) to (4, −2)", ans: 5, trap: 9 }, { q: "From (−3, −1) to (5, −1)", ans: 8, trap: 2 }] },
  ],
}));
