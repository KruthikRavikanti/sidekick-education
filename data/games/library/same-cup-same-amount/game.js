// Same Cup, Same Amount?. Skill 4.NF.C.7-2.
// Decimal comparisons are valid only for the same whole: 0.3 of a small cup is not 0.3 of a large cup.
Sidekick.game(Sidekick.play({
  title: "Same Cup, Same Amount?",
  emoji: "🥤",
  premise: "0.3 of a small cup and 0.3 of a big cup are not the same amount. Check the wholes before you compare.",
  outro: "Decimals can be compared only when they refer to the same whole.",
  scene: "kitchen",
  kind: "sort",
  hint: "Are both decimals parts of the same size whole?",
  tag: "compares_different_wholes",
  rounds: [
    { say: "Are the two amounts the same?", bins: "Same amount|Different amounts", items: ["0.3 of a cup and 0.3 of a same-size cup|0.5 of a mile and 0.50 of a mile", "0.3 of a small cup and 0.3 of a large cup|0.5 of a short rope and 0.5 of a long rope"], trap: ["0.3 of a small cup and 0.3 of a large cup", 0], why: "The cups are different sizes, so 0.3 of each is a different amount.", win: "Same whole, same amount." },
    { say: "Check the wholes.", bins: "Same amount|Different amounts", items: ["0.25 of a dollar and 0.25 of a dollar|0.7 of an hour and 0.70 of an hour", "0.25 of a small pizza and 0.25 of a large pizza|0.7 of a pond and 0.7 of a lake"], trap: ["0.7 of a pond and 0.7 of a lake", 0], why: "A pond and a lake are different wholes.", win: "You checked the wholes." },
    { say: "Sort these by yourself.", bins: "Same amount|Different amounts", items: ["0.4 of a liter and 0.40 of a liter|0.9 of a meter and 0.9 of a meter", "0.4 of a mug and 0.4 of a bucket|0.9 of a minute and 0.9 of an hour"], trap: ["0.4 of a mug and 0.4 of a bucket", 0] },
  ],
}));
