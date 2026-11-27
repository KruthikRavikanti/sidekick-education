// Give Each Outcome a Number. Skill S-MD.A.1-1.
// Defining a random variable and graphing its probability distribution. Confusing outcomes with values is the known slip.
Sidekick.game(Sidekick.play({
  title: "Give Each Outcome a Number",
  emoji: "🪙",
  premise: "A random variable turns each outcome into a number. Flip two coins and let X count the heads: X can be 0, 1 or 2.",
  outro: "A random variable assigns a number to each outcome. Its distribution lists each value with its probability.",
  scene: "desk",
  kind: "sort",
  fs: 6,
  hint: "Count the heads in each outcome. That count is the value of X.",
  tag: "outcomes_as_values",
  rounds: [
    { say: "X counts the heads in two flips. Sort each outcome by its value of X.", bins: "X = 0|X = 1|X = 2", items: ["TT|", "HT|TH", "HH|"], trap: ["TH", 2], why: "TH has one head. Two different outcomes both give X = 1.", win: "Four outcomes, three values." },
    { say: "Build the distribution. Set how many of the 4 outcomes give each value.", kind: "dial", cast: "", view: { type: "bars", names: ["X = 0", "X = 1", "X = 2"], cap: 4 }, dials: [["X = 0", 0, 4], ["X = 1", 0, 4], ["X = 2", 0, 4]], ans: [1, 2, 1], trap: [1, 1, 1], why: "The values are not equally likely. HT and TH both give 1.", win: "1, 2 and 1 out of 4." },
    { say: "Key in the probability as a fraction by yourself.", kind: "type", icon: "🪙", alt: [{ q: "X = number of heads in 2 flips. P(X = 1)?", ans: "2/4", trap: "1/3" }, { q: "X = number of heads in 2 flips. P(X = 0)?", ans: "1/4", trap: "1/3" }, { q: "X = number of heads in 3 flips (8 outcomes). P(X = 3)?", ans: "1/8", trap: "1/4" }] },
  ],
}));
