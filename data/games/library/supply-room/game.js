// Supply Room. Skill 4.OA.A.3-1.
// Multistep word problems with all four operations. Stopping partway, with the result of an early step, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Supply Room",
  emoji: "🏫",
  premise: "The school supply room has many-step problems. Keep track of each step until the very end.",
  outro: "Work one step at a time and keep track of what each number means.",
  scene: "desk",
  kind: "type",
  icon: "🏫",
  hint: "Write down what you found after each step, then use it in the next.",
  tag: "stops_partway",
  rounds: [
    { say: "Key in the final answer.", q: "A class gets 3 packs of 12 pencils. Then 10 pencils are given away. How many are left?", ans: 26, trap: 36, why: "36 is how many pencils came. Ten were given away after that.", win: "3 × 12 = 36, then 36 − 10 = 26." },
    { say: "Three steps this time.", q: "A school buys 6 boxes of 24 markers and gives 30 to each of 4 classes. How many are left?", ans: 24, trap: 144, why: "144 is how many were bought. Take away the 4 × 30 that were given out.", win: "144 − 120 = 24." },
    { say: "Solve it by yourself.", alt: [{ q: "A baker makes 5 trays of 18 rolls and sells 4 bags of 20 rolls. How many rolls are left?", ans: 10, trap: 90 }, { q: "A hall has 8 rows of 15 chairs. Then 3 rows of 15 are taken out. How many chairs are left?", ans: 75, trap: 120 }] },
  ],
}));
