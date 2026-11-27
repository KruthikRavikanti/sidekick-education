// Kilos and Liters. Skill 3.MD.A.2-2.
// One-step word problems with masses and liquid volumes in the same unit. Choosing the opposite operation is the known slip.
Sidekick.game(Sidekick.play({
  title: "Kilos and Liters",
  emoji: "⚗️",
  premise: "The kitchen lab weighs and pours all day. Read each problem and key in the amount.",
  outro: "Masses and volumes in the same unit can be added, subtracted, multiplied and divided.",
  scene: "kitchen",
  kind: "type",
  icon: "⚗️",
  hint: "Picture what is happening. Joining, comparing, equal groups?",
  tag: "picks_opposite_operation",
  rounds: [
    { say: "Key in the answer in kilograms.", q: "A cat weighs 4 kilograms and a dog weighs 9 kilograms. How much heavier is the dog?", ans: 5, trap: 13, why: "How much heavier is the difference, not the two together.", win: "9 − 4 = 5 kilograms." },
    { say: "Key in the answer in liters.", q: "Each bucket holds 6 liters. How many liters do 5 buckets hold?", ans: 30, trap: 11, why: "Five equal buckets is 5 groups of 6.", win: "5 × 6 = 30 liters." },
    { say: "Solve this one by yourself.", alt: [{ q: "A melon weighs 3 kilograms. How many kilograms do 8 melons weigh?", ans: 24, trap: 11 }, { q: "A tank had 40 liters. 15 liters were used. How many liters are left?", ans: 25, trap: 55 }] },
  ],
}));
