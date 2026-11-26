// More, Fewer, Same. Skill K.CC.C.6-3.
// Using the words more, fewer and the same: the child completes a comparison between two groups and reads it back with the word in place.
Sidekick.game(Sidekick.play({
  title: "More, Fewer, Same",
  emoji: "🧁",
  premise: "The baker lines up treats in two groups. Drop in the words that tell how the groups compare.",
  outro: "More, fewer, the same: now you can say how two groups compare.",
  scene: "candy",
  kind: "fill",
  cast: "",
  hint: "Count both groups. Fewer means a smaller number.",
  tag: "confuses_fewer_and_more",
  rounds: [
    { say: "Drag the words that make each line true.", rows: [["🔴🔴🔴 ___ 🔵🔵🔵🔵🔵🔵", "fewer than"], ["🟢🟢🟢🟢🟢 ___ 🟡🟡", "more than"]], extra: "the same as|", trap: [0, "more than"], why: "Red has 3 and blue has 6. Red has the smaller number, so it has fewer.", win: "3 is fewer than 6. 5 is more than 2." },
    { say: "Compare these treats.", rows: [["🍪🍪🍪🍪 ___ 🥛🥛🥛🥛", "the same as"], ["🐥🐥 ___ 🥚🥚🥚🥚🥚", "fewer than"]], extra: "more than|", trap: [1, "more than"], why: "2 chicks and 5 eggs. The chicks have the smaller number.", win: "4 is the same as 4. 2 is fewer than 5." },
    { say: "Finish every line by yourself.", rows: [["🌼🌼🌼🌼🌼🌼 ___ 🐝🐝🐝", "more than"], ["🧦🧦 ___ 👟👟", "the same as"], ["🍎🍎 ___ 🍌🍌🍌🍌🍌🍌🍌", "fewer than"]], trap: [2, "more than"] },
  ],
}));
