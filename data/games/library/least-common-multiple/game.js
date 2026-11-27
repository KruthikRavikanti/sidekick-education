// Least Common Multiple. Skill 6.NS.B.4-2.
// Finding the least common multiple of two whole numbers up to 12. Multiplying the numbers every time is the known slip.
Sidekick.game(Sidekick.play({
  title: "Least Common Multiple",
  emoji: "🚌",
  premise: "Two buses leave together, then on their own schedules. The least common multiple is when they next leave together.",
  outro: "The LCM is the smallest number both go into. It is often less than their product.",
  scene: "city",
  kind: "type",
  icon: "🚌",
  hint: "List the multiples of the bigger number. Stop at the first one the other divides.",
  tag: "always_multiplies",
  rounds: [
    { say: "Key in the least common multiple.", q: "LCM of 8 and 12", ans: 24, trap: 96, why: "96 is a common multiple, but not the least. Try the multiples of 12.", win: "24 is the first number both 8 and 12 divide." },
    { say: "Key in this one.", q: "LCM of 6 and 9", ans: 18, trap: 54, why: "54 works, but a smaller one works too. List multiples of 9.", win: "18 is the least common multiple." },
    { say: "Key in the LCM by yourself.", alt: [{ q: "LCM of 4 and 10", ans: 20, trap: 40 }, { q: "LCM of 6 and 8", ans: 24, trap: 48 }, { q: "LCM of 9 and 12", ans: 36, trap: 108 }] },
  ],
}));
