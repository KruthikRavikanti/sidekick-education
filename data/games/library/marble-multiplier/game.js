// Marble Multiplier. Skill 4.OA.A.2-1.
// Solving times-as-many problems with multiplication: a bar picture shows copies of the smaller amount. Adding the two numbers is the known slip.
Sidekick.game(Sidekick.play({
  title: "Marble Multiplier",
  emoji: "🪩",
  premise: "One friend has some. The other has several times as many. Key in the bigger amount.",
  outro: "Times as many means multiply.",
  scene: "candy",
  kind: "type",
  icon: "🪩",
  hint: "Picture that many copies of the smaller amount, side by side.",
  tag: "adds_the_numbers",
  rounds: [
    { say: "Key in how many Kim has.", fig: { type: "tape", top: [6], bottom: [6, 6, 6, 6], names: ["Jay", "Kim"] }, q: "Jay has 6 marbles. Kim has 4 times as many.", ans: 24, trap: 10, why: "Kim has 4 copies of Jay’s 6, not 6 and 4 more.", win: "4 × 6 = 24." },
    { say: "Key in how much the mom weighs.", q: "A pup weighs 7 kilograms. Its mom weighs 5 times as much.", ans: 35, trap: 12, why: "5 times as much means 5 copies of 7.", win: "5 × 7 = 35 kilograms." },
    { say: "Solve this one by yourself.", alt: [{ q: "Ty read 9 pages. Ana read 6 times as many. How many did Ana read?", ans: 54, trap: 15 }, { q: "A bush is 8 feet tall. A tree is 3 times as tall. How tall is the tree?", ans: 24, trap: 11 }] },
  ],
}));
