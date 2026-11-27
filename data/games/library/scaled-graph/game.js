// Scaled Graph. Skill 3.MD.B.3-1.
// Reading a scaled bar graph where each step is five: the bar height is the number of steps times five. Counting each step as one is the known slip.
Sidekick.game(Sidekick.play({
  title: "Scaled Graph",
  emoji: "🏟️",
  premise: "On this graph, each line going up stands for 5 votes, not 1. Read the bars with the scale in mind.",
  outro: "On a scaled graph, each step is worth more than one. Count by the scale.",
  scene: "paper",
  kind: "type",
  icon: "📊",
  hint: "Each line up is 5 more. Count by fives to the top of the bar.",
  tag: "counts_each_step_as_one",
  rounds: [
    { say: "Each line is 5 votes. Key in the answer.", fig: { type: "bars", given: [["⚽", 20], ["🎾", 10]], cap: 25, tick: 5, bare: true }, q: "How many votes did ⚽ get?", ans: 20, trap: 4, why: "The bar is 4 lines tall, and each line is 5 votes.", win: "4 fives is 20 votes." },
    { say: "Each line is 5 votes.", fig: { type: "bars", given: [["🍎", 15], ["🍌", 25], ["🍇", 5]], cap: 25, tick: 5, bare: true }, q: "How many votes did 🍌 get?", ans: 25, trap: 5, why: "The bar is 5 lines tall. Count by fives.", win: "5 fives is 25 votes." },
    { say: "Read the graph by yourself. Each line is 5.", alt: [{ fig: { type: "bars", given: [["🐶", 30], ["🐱", 20]], cap: 30, tick: 5, bare: true }, q: "How many votes did 🐶 get?", ans: 30, trap: 6 }, { fig: { type: "bars", given: [["🚗", 10], ["🚲", 35]], cap: 35, tick: 5, bare: true }, q: "How many votes did 🚲 get?", ans: 35, trap: 7 }] },
  ],
}));
