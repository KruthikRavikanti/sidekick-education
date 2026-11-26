// Ten and Some More. Skill K.NBT.A.1-2.
// Writing a teen number as 10 plus ones: the 1 in a teen number stands for a ten, so 16 is 10 + 6. Using the tile 1 instead of 10 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Ten and Some More",
  emoji: "🔟",
  premise: "Every teen number is a ten and some more. Drop in the missing piece of each number sentence.",
  outro: "A teen number is 10 and some ones.",
  scene: "candy",
  kind: "fill",
  cast: "",
  hint: "The 1 in a teen number means one ten.",
  tag: "reads_ten_as_one",
  rounds: [
    { say: "Drop in the missing piece of each number sentence.", rows: [["14 = ___ + 4", "10"], ["12 = 10 + ___", "2"]], extra: "1", trap: [0, "1"], why: "The 1 in 14 means one ten. Use 10.", win: "14 is 10 and 4. 12 is 10 and 2." },
    { say: "More teen numbers. What is missing?", rows: [["16 = ___ + 6", "10"], ["17 = 10 + ___", "7"]], extra: "1 6", trap: [0, "1"], why: "The 1 in 16 means one ten. Use 10.", win: "16 is 10 and 6. 17 is 10 and 7." },
    { say: "Finish these by yourself.", rows: [["18 = ___ + 8", "10"], ["15 = 10 + ___", "5"], ["13 = ___ + 3", "10"]], extra: "1 3", trap: [0, "1"] },
  ],
}));
