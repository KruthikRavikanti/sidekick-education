// More Votes. Skill 3.MD.B.3-3.
// How many more and how many less from a scaled bar graph: the difference between two values. Adding the two bars is the known slip.
Sidekick.game(Sidekick.play({
  title: "More Votes",
  emoji: "🗳️",
  premise: "The graph counts by fives. Compare two bars to find how many more or how many fewer.",
  outro: "How many more is the difference between two bars.",
  scene: "paper",
  kind: "type",
  icon: "🗳️",
  hint: "Read both bars from the side numbers. Then find the difference.",
  tag: "adds_instead_of_difference",
  rounds: [
    { say: "Use the graph. Key in the answer.", fig: { type: "bars", given: [["⚽", 30], ["🎾", 10]], cap: 30, tick: 5 }, q: "How many more votes did ⚽ get than 🎾?", ans: 20, trap: 40, why: "How many more is the difference: 30 take away 10.", win: "30 − 10 = 20 more." },
    { say: "Use the graph.", fig: { type: "bars", given: [["🍕", 25], ["🌮", 15], ["🍔", 35]], cap: 35, tick: 5 }, q: "How many fewer votes did 🌮 get than 🍔?", ans: 20, trap: 50, why: "How many fewer is the difference: 35 take away 15.", win: "35 − 15 = 20 fewer." },
    { say: "Compare the bars by yourself.", alt: [{ fig: { type: "bars", given: [["🐠", 40], ["🐢", 15]], cap: 40, tick: 5 }, q: "How many more votes did 🐠 get than 🐢?", ans: 25, trap: 55 }, { fig: { type: "bars", given: [["🎸", 20], ["🥁", 45]], cap: 45, tick: 5 }, q: "How many fewer votes did 🎸 get than 🥁?", ans: 25, trap: 65 }] },
  ],
}));
