// Sign Rules. Skill 7.NS.A.2-1.
// Understanding the rules for multiplying signed numbers. Thinking a negative times a negative is negative is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sign Rules",
  emoji: "✖️",
  premise: "When you multiply, matching signs give a positive and different signs give a negative.",
  outro: "Same signs multiply to a positive. Different signs multiply to a negative.",
  scene: "night",
  kind: "sort",
  fs: 6,
  hint: "Are the two signs the same or different?",
  tag: "negative_times_negative",
  rounds: [
    { say: "Is each product positive or negative?", bins: "Positive|Negative", items: ["−4 × −6|3 × 5", "−4 × 6|7 × −2"], trap: ["−4 × −6", 1], why: "Two negatives multiply to a positive. The opposite of −24 is 24.", win: "Same signs, positive." },
    { say: "Key in the product.", kind: "type", icon: "✖️", q: "−4 × −6", ans: 24, trap: -24, why: "Both signs are negative, so the product is positive.", win: "−4 × −6 = 24." },
    { say: "Sort these by yourself.", bins: "Positive|Negative", items: ["−3 × −9|−1 × −1|8 × 2", "−5 × 7|6 × −6"], trap: ["−3 × −9", 1] },
  ],
}));
