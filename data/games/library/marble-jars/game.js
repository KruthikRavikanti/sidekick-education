// Marble Jars. Skill K.MD.B.3-2.
// Counting how many are in each category: the marbles are mixed, and the child counts one color at a time. Counting all the marbles together is the known slip.
Sidekick.game(Sidekick.play({
  title: "Marble Jars",
  emoji: "🫙",
  premise: "The marbles are all mixed up. Count how many there are of each color and tag each color.",
  outro: "Count one color at a time to know how many are in each group.",
  scene: "candy",
  kind: "fill",
  cast: "",
  hint: "Pick one color. Count only the marbles of that color.",
  tag: "counts_all_together",
  rounds: [
    { say: "Count each color. Drag its number under it.", pic: "🔴🔴🔵🔴🔵", rows: [["🔴", "3"], ["🔵", "2"]], extra: "5", trap: [0, "5"], why: "That is all the marbles together. Count only the red ones.", win: "3 red and 2 blue." },
    { say: "Three colors now. Count each one.", pic: "🔴🔵🔴🟢🔴🔵🟢🔴", rows: [["🔴", "4"], ["🔵", "2"], ["🟢", "2"]], extra: "8", trap: [0, "8"], why: "That is all the marbles together. Count only the red ones.", win: "4 red, 2 blue, 2 green." },
    { say: "Count each color by yourself.", pic: "🟡🟣🟡🟡🟠🟣🟡🟠🟡", rows: [["🟡", "5"], ["🟣", "2"], ["🟠", "2"]], extra: "9", trap: [0, "9"] },
  ],
}));
