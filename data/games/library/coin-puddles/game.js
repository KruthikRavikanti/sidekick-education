// Coin Puddles. Skill K.CC.B.5-2.
// Counting scattered objects: the coins are not in a neat line, so the child has to keep track. Counting a coin twice gives a tag that is one too big.
Sidekick.game(Sidekick.play({
  title: "Coin Puddles",
  emoji: "🪙",
  premise: "Coins spilled all over the sidewalk in messy puddles. Count each puddle and give it a tag.",
  outro: "When things are scattered, count each one once and keep track.",
  scene: "city",
  kind: "fill",
  cast: "",
  hint: "Point to each coin one time. Do not go back to one you counted.",
  tag: "counts_one_twice",
  rounds: [
    { say: "Count each messy puddle. Drag the right tag to it.", rows: [["🪙 🪙🪙  🪙 🪙", "5"], ["🪙🪙 🪙", "3"]], extra: "6 4", trap: [0, "6"], why: "One coin got counted twice. Count each coin one time.", win: "Five coins and three coins." },
    { say: "Bigger puddles now. Keep track as you count.", rows: [["🪙🪙 🪙 🪙🪙 🪙🪙", "7"], ["🪙 🪙🪙 🪙", "4"]], extra: "8 5", trap: [0, "8"], why: "One coin got counted twice. There are 7.", win: "Seven coins and four coins." },
    { say: "Tag these puddles by yourself.", rows: [["🪙🪙🪙 🪙 🪙🪙", "6"], ["🪙 🪙 🪙🪙 🪙🪙🪙 🪙", "8"], ["🪙🪙", "2"]], extra: "7 9", trap: [1, "9"] },
  ],
}));
