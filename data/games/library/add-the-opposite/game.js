// Add the Opposite. Skill 7.NS.A.1-3.
// Understanding subtraction of rational numbers as adding the additive inverse. Changing only one sign is the known slip.
Sidekick.game(Sidekick.play({
  title: "Add the Opposite",
  emoji: "🔁",
  premise: "Subtracting a number is the same as adding its opposite. Change BOTH things: the minus becomes plus, and the number flips sign.",
  outro: "a − b = a + (−b). Change the operation and the sign of the second number.",
  scene: "desk",
  kind: "type",
  icon: "🔁",
  hint: "Subtract becomes add, and the second number becomes its opposite.",
  tag: "changes_one_sign",
  rounds: [
    { say: "Rewrite each subtraction as adding the opposite.", kind: "fill", fs: 5.8, cast: "", rows: [["4 − (−3) =", "4 + 3"], ["−2 − 5 =", "−2 + (−5)"]], extra: "4 + (−3)|", trap: [0, "4 + (−3)"], why: "That changed only the minus. The −3 must flip to 3 as well.", win: "Both parts changed." },
    { say: "Now key in the answer.", q: "4 − (−3)", ans: 7, trap: 1, why: "Subtracting −3 is adding 3. The answer is more than 4.", win: "4 + 3 = 7." },
    { say: "Key in the answer by yourself.", alt: [{ q: "6 − (−2)", ans: 8, trap: 4 }, { q: "−3 − (−5)", ans: 2, trap: -8 }, { q: "−1 − 4", ans: -5, trap: 3 }] },
  ],
}));
