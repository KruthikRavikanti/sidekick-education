// Trade for a Ten. Skill 1.NBT.B.2-1.
// Ten ones as one ten: the child shows a number with the fewest blocks, which means trading every ten ones for a rod. Leaving them all as ones is the known slip.
Sidekick.game(Sidekick.play({
  title: "Trade for a Ten",
  emoji: "🔄",
  premise: "Ten little cubes can be traded for one ten rod. Show each number with the fewest blocks you can.",
  outro: "Ten ones make one ten.",
  scene: "desk",
  kind: "dial",
  cast: "",
  hint: "Whenever you have 10 ones, trade them for a ten rod.",
  tag: "does_not_trade_ones",
  dials: [["Tens", 0, 3], ["Ones", 0, 19]],
  view: "tens",
  rounds: [
    { say: "Show 12 with the fewest blocks. Trade 10 ones for a ten.", ans: [1, 2], trap: [0, 12], why: "That is 12, but 10 of those ones can be one ten rod.", win: "1 ten and 2 ones." },
    { say: "Show 20 with the fewest blocks.", ans: [2, 0], trap: [1, 10], why: "Those 10 ones can be traded for another ten rod.", win: "2 tens and no ones." },
    { say: "Use the fewest blocks by yourself.", alt: [{ say: "Show 16 with the fewest blocks.", ans: [1, 6], trap: [0, 16] }, { say: "Show 23 with the fewest blocks.", ans: [2, 3], trap: [1, 13] }, { say: "Show 30 with the fewest blocks.", ans: [3, 0], trap: [2, 10] }] },
  ],
}));
