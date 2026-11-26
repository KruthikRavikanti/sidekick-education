// Egg Carton. Skill K.OA.A.4-2.
// Making ten: a ten-spot carton shows the eggs already there, and the child adds eggs until the carton is full, seeing the partner number that makes 10.
Sidekick.game(Sidekick.play({
  title: "Egg Carton",
  emoji: "🥚",
  premise: "The carton holds 10 eggs. Some are already in. Add eggs until every spot is full.",
  outro: "Every number from 1 to 9 has a partner that makes 10.",
  scene: "kitchen",
  kind: "dial",
  cast: "🐔",
  hint: "Count the empty spots. That is how many more make 10.",
  tag: "one_short_of_ten",
  dials: [["Eggs to add", 0, 10]],
  rounds: [
    { say: "The carton has 6 eggs. Add eggs until all 10 spots are full.", view: { type: "mix", icons: "🥚 🐣", cols: 5, slots: 10, pre: [6] }, ans: [4], trap: [3], why: "One spot is still empty. Every spot needs an egg.", win: "6 and 4 make 10." },
    { say: "This carton has 8 eggs. Fill it up.", view: { type: "mix", icons: "🥚 🐣", cols: 5, slots: 10, pre: [8] }, ans: [2], trap: [1], why: "One spot is still empty. Every spot needs an egg.", win: "8 and 2 make 10." },
    { say: "Fill this carton by yourself.", alt: [{ view: { type: "mix", icons: "🥚 🐣", cols: 5, slots: 10, pre: [7] }, ans: [3], trap: [2] }, { view: { type: "mix", icons: "🥚 🐣", cols: 5, slots: 10, pre: [5] }, ans: [5], trap: [4] }, { view: { type: "mix", icons: "🥚 🐣", cols: 5, slots: 10, pre: [3] }, ans: [7], trap: [6] }] },
  ],
}));
