// Long Run Chance. Skill 7.SP.C.6-1.
// Approximating the probability of a chance event from its long-run relative frequency. Expecting the result to match theory regardless of data is the known slip.
Sidekick.game(Sidekick.play({
  title: "Long Run Chance",
  emoji: "🎡",
  premise: "Do something many times and count. The fraction of times an outcome happens is a good estimate of its probability.",
  outro: "Estimated probability = times it happened ÷ total trials, from a long run.",
  scene: "candy",
  kind: "type",
  icon: "🎡",
  hint: "Use the data: how many times out of how many?",
  tag: "ignores_long_run_data",
  rounds: [
    { say: "Key in the estimate of P(red) as a decimal.", q: "A spinner has 4 colors. It lands on red 30 times in 100 spins.", ans: "0.3", trap: "0.25", why: "The sections may not be equal. The data says 30 out of 100.", win: "30 ÷ 100 = 0.3." },
    { say: "Key in the estimate of P(side) as a decimal.", q: "A cup lands on its side 70 times in 100 tosses.", ans: "0.7", trap: "0.5", why: "Two outcomes are not always equally likely. Use the data.", win: "70 ÷ 100 = 0.7." },
    { say: "Estimate the probability by yourself, as a decimal.", alt: [{ q: "A tack lands point up 45 times in 100 drops.", ans: "0.45", trap: "0.5" }, { q: "A bent coin lands heads 60 times in 100 flips.", ans: "0.6", trap: "0.5" }, { q: "A bottle lands upright 15 times in 100 flips.", ans: "0.15", trap: "0.5" }] },
  ],
}));
