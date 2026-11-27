// Signed Decimal Sums. Skill 7.NS.A.1-5.
// Adding and subtracting rational numbers fluently. Applying the rule that two negatives make a positive to addition is the known slip.
Sidekick.game(Sidekick.play({
  title: "Signed Decimal Sums",
  emoji: "🧾",
  premise: "Adding two negatives gives a bigger negative. The rule about two negatives making a positive is only for multiplying and for subtracting a negative.",
  outro: "Negative + negative stays negative. Subtracting a negative is adding.",
  scene: "city",
  kind: "type",
  icon: "🧾",
  hint: "Think of debts. Two debts together are a bigger debt.",
  tag: "two_negatives_in_addition",
  rounds: [
    { say: "Key in the sum.", q: "−1.5 + (−2.5)", ans: "-4", trap: "4", why: "Two debts make a bigger debt. The sum stays negative.", win: "−1.5 + (−2.5) = −4." },
    { say: "Key in the answer.", q: "−2.5 + 1.75 − (−3)", ans: "2.25", trap: "-3.75", why: "Subtracting −3 is adding 3: −0.75 + 3.", win: "−0.75 + 3 = 2.25." },
    { say: "Key in the answer by yourself.", alt: [{ q: "−3.2 + (−1.8)", ans: "-5", trap: "5" }, { q: "−4 + (−6)", ans: "-10", trap: "10" }, { q: "2.5 − (−1.5)", ans: "4", trap: "1" }] },
  ],
}));
