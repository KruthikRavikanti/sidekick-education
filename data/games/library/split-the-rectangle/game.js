// Split the Rectangle. Skill 3.MD.C.7-3.
// Area models for the distributive property: a 4 by 7 rectangle is a 4 by 5 and a 4 by 2 together. Forgetting the second part is the known slip.
Sidekick.game(Sidekick.play({
  title: "Split the Rectangle",
  emoji: "🧮",
  premise: "Cut a rectangle into two smaller ones along the orange line. Their areas add up to the whole.",
  outro: "A rectangle can be split in two, and the two areas add to the whole area.",
  scene: "paper",
  kind: "fill",
  cast: "",
  hint: "Find the area of each part, then add them.",
  tag: "forgets_one_part",
  rounds: [
    { say: "The rectangle is 4 by 7, split at 5. Finish both lines.", fig: { type: "rect", d: [7, 4], l: [], grid: true, split: 5 }, rows: [["4 × 7 = (4 × 5) + (4 × ___)", "2"], ["20 + 8 = ___", "28"]], extra: "7 20", trap: [1, "20"], why: "The second part counts too. Add its 8 squares.", win: "20 + 8 = 28." },
    { say: "The rectangle is 3 by 8, split at 5.", fig: { type: "rect", d: [8, 3], l: [], grid: true, split: 5 }, rows: [["3 × 8 = (3 × 5) + (3 × ___)", "3"], ["15 + 9 = ___", "24"]], extra: "8 15", trap: [1, "15"], why: "The second part counts too. Add its 9 squares.", win: "15 + 9 = 24." },
    { say: "The rectangle is 6 by 9, split at 5. Finish by yourself.", fig: { type: "rect", d: [9, 6], l: [], grid: true, split: 5 }, rows: [["6 × 9 = (6 × 5) + (6 × ___)", "4"], ["30 + 24 = ___", "54"]], extra: "9 30", trap: [1, "30"] },
  ],
}));
