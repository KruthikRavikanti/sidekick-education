// Trade for a Hundred. Skill 2.NBT.A.1-1.
// Ten tens as one hundred: the child shows a number with the fewest blocks, trading every ten rods for a flat. Leaving them as tens is the known slip.
Sidekick.game(Sidekick.play({
  title: "Trade for a Hundred",
  emoji: "💯",
  premise: "Ten ten-rods can be traded for one hundred flat. Show each number with the fewest blocks.",
  outro: "Ten tens make one hundred.",
  scene: "desk",
  kind: "dial",
  cast: "",
  view: "tens",
  dials: [["Hundreds", 0, 3], ["Tens", 0, 19], ["Ones", 0, 9]],
  hint: "Whenever you have 10 tens, trade them for a hundred.",
  tag: "does_not_trade_tens",
  rounds: [
    { say: "Show 120 with the fewest blocks. Trade 10 tens for a hundred.", ans: [1, 2, 0], trap: [0, 12, 0], why: "That is 120, but 10 of those tens can be one hundred flat.", win: "1 hundred and 2 tens." },
    { say: "Show 200 with the fewest blocks.", ans: [2, 0, 0], trap: [1, 10, 0], why: "Those 10 tens can be traded for another hundred.", win: "2 hundreds." },
    { say: "Use the fewest blocks by yourself.", alt: [{ say: "Show 150 with the fewest blocks.", ans: [1, 5, 0], trap: [0, 15, 0] }, { say: "Show 210 with the fewest blocks.", ans: [2, 1, 0], trap: [1, 11, 0] }] },
  ],
}));
