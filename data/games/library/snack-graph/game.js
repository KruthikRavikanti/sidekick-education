// Snack Graph. Skill GA-K-MDR.7.3-1.
// Answering questions from a simple graph: the child reads the bar for the group asked about. Reading the tallest bar for every question is the known slip.
Sidekick.game(Sidekick.play({
  title: "Snack Graph",
  emoji: "📊",
  premise: "The class made a graph of their favorites. Read one bar at a time to answer each question.",
  outro: "Each bar tells about just one group. Read the bar you are asked about.",
  scene: "paper",
  kind: "dial",
  cast: "",
  hint: "Find the picture under the bar. Then read how high that bar goes.",
  tag: "reads_the_tallest_bar",
  dials: [["How many", 0, 10]],
  view: { type: "text", text: "{0}" },
  rounds: [
    { say: "How many kids picked 🍌? Read its bar and set the number.", fig: { type: "bars", given: [["🍎", 4], ["🍌", 2], ["🍊", 5]], cap: 6 }, ans: [2], trap: [5], why: "That is the tallest bar. Find the 🍌 bar and read across.", win: "2 kids picked 🍌." },
    { say: "How many kids have a 🐶? Read its bar.", fig: { type: "bars", given: [["🐶", 3], ["🐱", 6], ["🐟", 1]], cap: 6 }, ans: [3], trap: [6], why: "That is the tallest bar. Find the 🐶 bar.", win: "3 kids have a 🐶." },
    { say: "Read the graph by yourself.", alt: [{ say: "How many kids like 🎾 best? Read its bar.", fig: { type: "bars", given: [["⚽", 5], ["🏀", 2], ["🎾", 4]], cap: 6 }, ans: [4], trap: [5] }, { say: "How many days were ⛅? Read its bar.", fig: { type: "bars", given: [["🌧️", 1], ["☀️", 6], ["⛅", 3]], cap: 6 }, ans: [3], trap: [6] }] },
  ],
}));
