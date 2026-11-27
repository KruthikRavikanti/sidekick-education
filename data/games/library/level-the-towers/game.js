// Level the Towers. Skill 6.SP.A.3-3.
// Finding the mean as a fair share. Adding the values but forgetting to divide is the known slip.
Sidekick.game(Sidekick.play({
  title: "Level the Towers",
  emoji: "🧱",
  premise: "The mean is a fair share. Move blocks from tall towers to short ones until every tower is the same height.",
  outro: "Mean = total ÷ how many. It is the height of every tower after levelling.",
  scene: "candy",
  kind: "type",
  hint: "Add them all up, then share the total equally.",
  tag: "forgets_to_divide",
  rounds: [
    { say: "Towers of 2, 4 and 9 blocks. Level them. Keep all 15 blocks.", kind: "dial", cast: "", view: { type: "bars", names: ["A", "B", "C"], cap: 10 }, dials: [["A", 0, 10, 1, 2], ["B", 0, 10, 1, 4], ["C", 0, 10, 1, 9]], ans: [5, 5, 5], trap: [4, 4, 4], why: "That uses only 12 blocks. All 15 must be shared.", win: "15 blocks ÷ 3 towers = 5 each." },
    { say: "Key in the mean.", q: "Find the mean of 4, 6, 8, 10, 12.", ans: 8, trap: 40, why: "That is the total. Share it among the 5 values.", win: "40 ÷ 5 = 8." },
    { say: "Find the mean by yourself.", alt: [{ q: "Find the mean of 3, 5, 7, 9.", ans: 6, trap: 24 }, { q: "Find the mean of 10, 20, 30.", ans: 20, trap: 60 }, { q: "Find the mean of 2, 4, 4, 6, 9.", ans: 5, trap: 25 }] },
  ],
}));
