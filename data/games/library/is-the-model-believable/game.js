// Is the Model Believable?. Skill S-IC.A.2-1.
// Deciding if a model is consistent with results from a data-generating process using simulation. Rejecting a model after one mildly surprising result is the known slip.
Sidekick.game(Sidekick.play({
  title: "Is the Model Believable?",
  emoji: "🪙",
  premise: "To test a claim, simulate it many times and see how often your result shows up. Rare results cast doubt. Common ones do not.",
  outro: "One surprising result is weak evidence. Compare it with what the model produces over many simulated runs.",
  scene: "desk",
  kind: "sort",
  fs: 4.8,
  hint: "How often would a fair coin do this just by chance?",
  tag: "rejects_too_quickly",
  rounds: [
    { say: "A coin is claimed to be fair. Which results are strong evidence against that?", bins: "Could be chance|Strong evidence", items: ["6 heads in 10 flips|5 heads in a row|27 heads in 50 flips", "95 heads in 100 flips|48 heads in 50 flips"], trap: ["5 heads in a row", 1], why: "A fair coin does that about 3 times in 100 tries. Unusual, but it happens.", win: "Only very rare results are strong evidence." },
    { say: "A fair coin was flipped 10 times, in 94 simulated sets. The chart counts sets by number of heads. Key in how many sets had 9 heads.", kind: "type", icon: "🪙", fig: { type: "bars", given: [["3", 12], ["4", 20], ["5", 25], ["6", 21], ["7", 11], ["8", 4], ["9", 1]], cap: 30, tick: 5, v: [] }, ans: 1, trap: 9, why: "9 is the number of heads. Read the height of that bar.", win: "Only 1 set in 94. Nine heads is rare for a fair coin." },
    { say: "A spinner is claimed to land on red half of the time. Sort these by yourself.", bins: "Could be chance|Strong evidence", items: ["11 reds in 20 spins|4 reds in a row|52 reds in 100 spins", "90 reds in 100 spins|2 reds in 60 spins"], trap: ["4 reds in a row", 1] },
  ],
}));
