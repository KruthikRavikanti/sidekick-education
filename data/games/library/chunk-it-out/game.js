// Chunk It Out. Skill 4.NBT.B.6-2.
// Dividing with partial quotients: easy multiples of the divisor are subtracted and the partial quotients are added. Writing the partial quotients side by side instead of adding is the known slip.
Sidekick.game(Sidekick.play({
  title: "Chunk It Out",
  emoji: "🥖",
  premise: "Take away big friendly chunks of the divisor, one at a time. Add up the chunks to get the answer.",
  outro: "Partial quotients: subtract easy multiples, then add how many you took.",
  scene: "kitchen",
  kind: "fill",
  cast: "",
  hint: "Add the chunks: hundreds, tens and ones together.",
  tag: "does_not_add_the_parts",
  rounds: [
    { say: "Divide 96 by 4 in chunks.", rows: [["Take 20 fours, which is 80. Left: ___", "16"], ["Then 4 fours. Total: 20 + 4 = ___", "24"]], extra: "204 76", trap: [1, "204"], why: "20 and 4 are added: 24, not 204.", win: "96 ÷ 4 = 24." },
    { say: "Divide 852 by 6 in chunks.", rows: [["Take 100 sixes, which is 600. Left: ___", "252"], ["Then 40 sixes, which is 240. Left: ___", "12"], ["Then 2 sixes. Total: 100 + 40 + 2 = ___", "142"]], extra: "246 1402", trap: [2, "1402"], why: "Add the chunks: 100 + 40 + 2 is 142.", win: "852 ÷ 6 = 142." },
    { say: "Divide 738 by 3 in chunks by yourself.", rows: [["Take 200 threes, which is 600. Left: ___", "138"], ["Then 40 threes, which is 120. Left: ___", "18"], ["Then 6 threes. Total: 200 + 40 + 6 = ___", "246"]], extra: "2046 132", trap: [2, "2046"] },
  ],
}));
