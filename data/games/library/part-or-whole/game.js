// Part or Whole?. Skill 6.RP.A.1-2.
// Telling part-to-part from part-to-whole ratios. Using the total when the question asks part to part is the known slip.
Sidekick.game(Sidekick.play({
  title: "Part or Whole?",
  emoji: "🔵",
  premise: "Some ratios compare one part with another part. Others compare a part with the whole group. Read which one is asked.",
  outro: "Part-to-part compares two groups. Part-to-whole compares one group with the total.",
  scene: "candy",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Does the question say all, total or whole? Then use the total.",
  tag: "mixes_part_and_whole",
  rounds: [
    { say: "Match each ratio.", pic: "🔴🔴🔴🔵🔵", rows: [["red to blue", "3 : 2"], ["red to all marbles", "3 : 5"], ["blue to all marbles", "2 : 5"]], trap: [1, "3 : 2"], why: "All marbles means the total, which is 5.", win: "Two part-to-whole ratios and one part-to-part." },
    { say: "Match each ratio.", pic: "⚽⚽⚽⚽🏀🏀🏀🏀🏀🏀", rows: [["soccer balls to basketballs", "4 : 6"], ["soccer balls to all balls", "4 : 10"], ["basketballs to all balls", "6 : 10"]], trap: [0, "4 : 10"], why: "The question compares the two kinds, not a kind with the total.", win: "Part to part, then part to whole." },
    { say: "Match these by yourself.", pic: "🌹🌹🌷🌷🌷🌷🌷", rows: [["roses to tulips", "2 : 5"], ["roses to all flowers", "2 : 7"], ["tulips to all flowers", "5 : 7"]], extra: "5 : 2", trap: [1, "2 : 5"] },
  ],
}));
