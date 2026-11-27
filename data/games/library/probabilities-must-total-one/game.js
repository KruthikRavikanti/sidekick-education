// Probabilities Must Total One. Skill S-MD.A.3-1.
// Developing a probability distribution from theoretical probabilities. Ending with probabilities that do not sum to 1 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Probabilities Must Total One",
  emoji: "🧩",
  premise: "Build a distribution from theory: find the probability of every value. Together they must add up to exactly 1.",
  outro: "Work out each probability with the rules, count every order, and check that the total is 1.",
  scene: "desk",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Right then miss, and miss then right, are two different ways to get exactly one.",
  tag: "does_not_sum_to_one",
  rounds: [
    { say: "You guess on 2 questions with 4 choices each. X is the number correct.", rows: [["P(both correct)", "{1/4} × {1/4} = {1/16}"], ["P(both missed)", "{3/4} × {3/4} = {9/16}"], ["P(exactly one correct)", "{6/16}"]], extra: "{3/16}", trap: [2, "{3/16}"], why: "There are two orders: right then miss, and miss then right. And 1 + 9 + 3 is only 13 of 16.", win: "9 + 6 + 1 = 16 sixteenths." },
    { say: "Build that distribution in sixteenths.", kind: "dial", cast: "", view: { type: "bars", names: ["0 correct", "1 correct", "2 correct"], cap: 10, tick: 2 }, dials: [["0 correct", 0, 10], ["1 correct", 0, 10], ["2 correct", 0, 10]], ans: [9, 6, 1], trap: [9, 3, 1], why: "Those add to 13, not 16. Exactly one correct can happen in two orders.", win: "9, 6 and 1 sixteenths." },
    { say: "Key in the missing probability as a fraction by yourself.", kind: "type", icon: "🧩", alt: [{ q: "Two coin flips: P(0 heads) = {1/4} and P(2 heads) = {1/4}. P(1 head)?", ans: "2/4", trap: "1/4" }, { q: "P(0) = {9/16} and P(2) = {1/16}. The only other value is 1. P(1)?", ans: "6/16", trap: "3/16" }, { q: "P(red) = {3/8} and P(blue) = {1/8}. The only other color is green. P(green)?", ans: "4/8", trap: "3/8" }] },
  ],
}));
