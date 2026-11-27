// How Far Apart?. Skill 7.NS.A.1-4.
// Showing that the distance between two rational numbers is the absolute value of their difference. Getting negative distances is the known slip.
Sidekick.game(Sidekick.play({
  title: "How Far Apart?",
  emoji: "📍",
  premise: "The distance between two numbers is how many steps apart they are. Subtract them, then take the absolute value.",
  outro: "Distance = |a − b|. A distance is never negative.",
  scene: "snow",
  kind: "type",
  icon: "📍",
  hint: "Count the steps between the two points on the line.",
  tag: "negative_distance",
  rounds: [
    { say: "Key in the distance between −4 and 9.", fig: { type: "numline", line: [-6, 10, 1, 2], pts: [[-4, "−4"], [9, "9"]], v: [] }, ans: 13, trap: -13, trap2: 5, why: "A distance cannot be negative. Take the absolute value.", why2: "They are on opposite sides of 0: 4 steps, then 9 more.", win: "|−4 − 9| = 13." },
    { say: "Key in the distance between −7 and −2.", fig: { type: "numline", line: [-8, 2, 1, 2], pts: [[-7, "−7"], [-2, "−2"]], v: [] }, ans: 5, trap: -5, why: "Count the steps between them. Steps are counted as positive.", win: "|−7 − (−2)| = 5." },
    { say: "Find the distance by yourself.", alt: [{ q: "Between −6 and 3", ans: 9, trap: -9 }, { q: "Between 5 and −5", ans: 10, trap: -10 }, { q: "Between −8 and −1", ans: 7, trap: -7 }] },
  ],
}));
