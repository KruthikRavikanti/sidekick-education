// Across, Then Up. Skill 5.G.A.1-1.
// Understanding axes, the origin and ordered pairs: the first coordinate is the horizontal distance. Reversing x and y is the known slip.
Sidekick.game(Sidekick.play({
  title: "Across, Then Up",
  emoji: "🗺️",
  premise: "A treasure map uses two numbers for every spot. The first says how far across, the second says how far up.",
  outro: "In an ordered pair, the first number is across (x) and the second is up (y). Both start at the origin.",
  scene: "sand",
  kind: "fill",
  cast: "",
  hint: "First number: walk across. Second number: climb up.",
  tag: "reverses_x_and_y",
  rounds: [
    { say: "Finish the rules of the map.", rows: [["In (3, 5), the 3 tells how far ___", "across"], ["In (3, 5), the 5 tells how far ___", "up"], ["The point (0, 0) is called the ___", "origin"]], extra: "x-axis", trap: [0, "up"], why: "The first number always goes across.", win: "Across, up, and the origin." },
    { say: "Tap the point (3, 5) to bury the treasure.", kind: "plot", cast: "", axes: [0, 7, 0, 7], ans: [[3, 5]], trap: [[5, 3]], why: "That is (5, 3). Go across 3 first, then up 5.", win: "Across 3, up 5." },
    { say: "Finish these by yourself.", rows: [["In (2, 7), go ___ 2", "across"], ["In (2, 7), go ___ 7", "up"], ["Both axes meet at the ___", "origin"]], extra: "y-axis", trap: [0, "up"] },
  ],
}));
