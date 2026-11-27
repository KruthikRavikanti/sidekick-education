// Star Chart. Skill 5.G.A.1-2.
// Locating points from ordered pairs in the first quadrant. Reversing the coordinates or miscounting from the origin is the known slip.
Sidekick.game(Sidekick.play({
  title: "Star Chart",
  emoji: "🌟",
  premise: "Each star has an address made of two numbers. Count the steps from the origin to put each star in its place.",
  outro: "Start at the origin. Count spaces across, then spaces up.",
  scene: "night",
  kind: "plot",
  cast: "",
  hint: "Start at (0, 0). The first number is across, the second is up.",
  tag: "miscounts_or_reverses",
  rounds: [
    { say: "Tap the point (4, 3).", ans: [[4, 3]], trap: [[3, 4]], why: "That is (3, 4). Go across 4 first, then up 3.", win: "Across 4, up 3." },
    { say: "A star is 2 units right and 6 units up from the origin. Tap its place.", ans: [[2, 6]], trap: [[1, 5]], why: "Count spaces, not lines. The origin is 0, so the first step lands on 1.", win: "The star is at (2, 6)." },
    { say: "Place the star by yourself.", alt: [{ say: "Tap the point (5, 2) by yourself.", ans: [[5, 2]], trap: [[2, 5]] }, { say: "Tap the point (1, 7) by yourself.", ans: [[1, 7]], trap: [[7, 1]] }, { say: "Tap the point (6, 4) by yourself.", ans: [[6, 4]], trap: [[4, 6]] }] },
  ],
}));
