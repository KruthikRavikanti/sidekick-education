// Best Garden for the Fence. Skill G-MG.A.3-1.
// Applying geometric methods to solve design problems with constraints. Ignoring a constraint is the known slip.
Sidekick.game(Sidekick.play({
  title: "Best Garden for the Fence",
  emoji: "🌻",
  premise: "A design problem has a goal and a limit. Here the limit is the fence you own, and the goal is the most growing space.",
  outro: "Satisfy every constraint first, then pick the design that best meets the goal. For a fixed perimeter, the square has the most area.",
  scene: "meadow",
  kind: "dial",
  cast: "",
  dials: [["Across", 1, 9, 1, 2], ["Down", 1, 9, 1, 2]],
  view: { type: "rect", grid: true, calc: true, unit: 60 },
  hint: "The distance around must match the fence exactly. Then compare the space inside.",
  tag: "ignores_constraint",
  tag2: "meets_limit_not_goal",
  rounds: [
    { say: "You have exactly 20 feet of fence. Build the rectangle with the most space inside.", ans: [5, 5], trap: [9, 9], why: "That needs 36 feet of fence. You only have 20.", trap2: [8, 2], why2: "That uses 20 feet, but only 16 square feet inside. Try sides closer together.", win: "5 by 5: around 20, inside 25." },
    { say: "Now you have exactly 16 feet of fence. Build the rectangle with the most space inside.", ans: [4, 4], trap: [6, 6], why: "That needs 24 feet of fence. The limit is 16.", trap2: [7, 1], why2: "That uses 16 feet, but only 7 square feet inside.", win: "4 by 4: around 16, inside 16." },
    { say: "By yourself: use exactly 12 feet of fence and get the most space inside.", ans: [3, 3], trap: [9, 9], trap2: [5, 1] },
  ],
}));
