// Ribbon Copies. Skill 4.OA.A.2-2.
// Solving how-many-times-as-many problems with division: the typed number lays that many copies of the smaller amount under the larger. Subtracting is the known slip.
Sidekick.game(Sidekick.play({
  title: "Ribbon Copies",
  emoji: "🧣",
  premise: "How many copies of the short one fit along the long one? Key in a number and watch the copies line up.",
  outro: "How many times as many is a division question.",
  scene: "candy",
  kind: "type",
  hint: "Keep adding copies until they reach the end of the long bar.",
  tag: "subtracts_the_numbers",
  rounds: [
    { say: "How many times as long is the red ribbon? Key it in.", q: "The red ribbon is 28 inches. The blue ribbon is 7 inches.", view: { type: "tape", top: [28], rep: 7, names: ["red", "blue copies"] }, ans: 4, trap: 21, why: "21 is how much longer. Count how many blue ribbons fit along the red one.", win: "28 ÷ 7 = 4 times as long." },
    { say: "How many times as tall is the tree?", q: "A tree is 36 feet tall. A bush is 9 feet tall.", view: { type: "tape", top: [36], rep: 9, names: ["tree", "bush copies"] }, ans: 4, trap: 27, why: "27 is how much taller. Count how many bushes stack up to the tree.", win: "36 ÷ 9 = 4 times as tall." },
    { say: "Find how many times by yourself.", alt: [{ q: "A whale is 45 feet long. A shark is 5 feet long. How many times as long is the whale?", view: { type: "tape", top: [45], rep: 5, names: ["whale", "shark copies"] }, ans: 9, trap: 40 }, { q: "A bus holds 32 riders. A van holds 8 riders. How many times as many does the bus hold?", view: { type: "tape", top: [32], rep: 8, names: ["bus", "van copies"] }, ans: 4, trap: 24 }] },
  ],
}));
