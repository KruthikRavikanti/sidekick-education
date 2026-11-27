// Class Vote. Skill 1.MD.C.4-2.
// Answering how many in each category and in all from a chart. Giving one bar when asked for the total is the known slip.
Sidekick.game(Sidekick.play({
  title: "Class Vote",
  emoji: "🗳️",
  premise: "The class voted and made a chart. Use it to answer how many in one group and how many in all.",
  outro: "One bar tells one group. All the bars together tell how many in all.",
  scene: "paper",
  kind: "type",
  icon: "🗳️",
  hint: "In all means every bar added together.",
  tag: "gives_one_bar_for_total",
  rounds: [
    { say: "Read the chart. Key in the answer.", fig: { type: "bars", given: [["🍎", 5], ["🍇", 3], ["🍐", 4]], values: true, cap: 5 }, q: "How many kids picked 🍇?", ans: 3, trap: 5, why: "Find the 🍇 bar. Read the number on that bar.", win: "3 kids picked 🍇." },
    { say: "Now use every bar.", fig: { type: "bars", given: [["🍎", 5], ["🍇", 3], ["🍐", 4]], values: true, cap: 5 }, q: "How many kids voted in all?", ans: 12, trap: 5, why: "In all means add every bar: 5 and 3 and 4.", win: "5 + 3 + 4 = 12 kids." },
    { say: "Answer by yourself.", alt: [{ fig: { type: "bars", given: [["🐶", 6], ["🐱", 4], ["🐟", 2]], values: true, cap: 6 }, q: "How many pets in all?", ans: 12, trap: 6 }, { fig: { type: "bars", given: [["⚽", 3], ["🏀", 5], ["🎾", 6]], values: true, cap: 6 }, q: "How many kids voted in all?", ans: 14, trap: 6 }, { fig: { type: "bars", given: [["🚲", 4], ["🛴", 7], ["🛹", 2]], values: true, cap: 7 }, q: "How many rides in all?", ans: 13, trap: 7 }] },
  ],
}));
