// How Many More?. Skill 1.MD.C.4-3.
// Comparing categories from a chart: how many more is the difference. Answering with the larger count is the known slip.
Sidekick.game(Sidekick.play({
  title: "How Many More?",
  emoji: "📶",
  premise: "Two bars stand side by side. Find how much taller one is than the other.",
  outro: "How many more is the difference between two groups.",
  scene: "paper",
  kind: "dial",
  cast: "",
  hint: "Start at the shorter bar. How many more steps to reach the taller one?",
  tag: "gives_the_larger_count",
  tag2: "adds_both_counts",
  dials: [["How many more", 0, 12]],
  view: { type: "text", text: "{0} more" },
  rounds: [
    { say: "How many more picked 🍎 than 🍇? Set the number.", fig: { type: "bars", given: [["🍎", 5], ["🍇", 3]], values: true, cap: 5 }, ans: [2], trap: [5], trap2: [8], why: "That is how many picked 🍎. How many more is only the extra part.", why2: "That is both bars together. Find only the extra part.", win: "5 is 2 more than 3." },
    { say: "How many more 🚲 than 🛴?", fig: { type: "bars", given: [["🚲", 7], ["🛴", 4]], values: true, cap: 7 }, ans: [3], trap: [7], why: "That is how many 🚲 there are. Find only the extra part.", win: "7 is 3 more than 4." },
    { say: "Find how many more by yourself.", alt: [{ say: "How many more 🌞 days than 🌧️ days?", fig: { type: "bars", given: [["🌞", 6], ["🌧️", 2]], values: true, cap: 6 }, ans: [4], trap: [6], trap2: [8] }, { say: "How many more 🐕 than 🐈?", fig: { type: "bars", given: [["🐕", 8], ["🐈", 5]], values: true, cap: 8 }, ans: [3], trap: [8] }, { say: "How many more 🍕 than 🌮?", fig: { type: "bars", given: [["🍕", 9], ["🌮", 4]], values: true, cap: 9 }, ans: [5], trap: [9] }] },
  ],
}));
