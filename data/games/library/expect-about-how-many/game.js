// Expect About How Many?. Skill 7.SP.C.6-2.
// Predicting the approximate relative frequency given the probability. Thinking an outcome is due after a streak is the known slip.
Sidekick.game(Sidekick.play({
  title: "Expect About How Many?",
  emoji: "🔮",
  premise: "A probability lets you predict about how often something will happen in many tries. It never says what the very next try will be.",
  outro: "Expected count = probability × number of trials. Past results do not change the next one.",
  scene: "night",
  kind: "type",
  icon: "🔮",
  hint: "Multiply the probability by the number of tries.",
  tag: "thinks_outcome_is_due",
  rounds: [
    { say: "Key in about how many reds to expect.", q: "P(red) = 0.3. The spinner is spun 500 times.", ans: 150, trap: 30, why: "30 would be for 100 spins. There are 500 spins.", win: "0.3 × 500 = 150." },
    { say: "A fair coin lands tails 5 times in a row. True or not true?", kind: "sort", fs: 4.8, bins: "True|Not true", items: ["The next flip is still 50-50|In 1,000 flips, expect about 500 heads", "Heads is due next|Tails is hot, so tails is more likely"], trap: ["Heads is due next", 0], why: "The coin has no memory. Each flip is 50-50.", win: "Streaks do not change the next flip." },
    { say: "Predict by yourself.", alt: [{ q: "P(win) = 0.2. About how many wins in 50 games?", ans: 10, trap: 20 }, { q: "P(heads) = 0.5. About how many heads in 80 flips?", ans: 40, trap: 50 }, { q: "P(blue) = 0.25. About how many blues in 200 spins?", ans: 50, trap: 25 }] },
  ],
}));
