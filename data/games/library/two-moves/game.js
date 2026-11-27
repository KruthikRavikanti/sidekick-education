// Two Moves. Skill 3.OA.D.8-1.
// Two-step word problems with different operations. Stopping after the first step is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Moves",
  emoji: "♟️",
  premise: "These problems take two moves, and each move may need a different operation. Finish both.",
  outro: "Plan both steps, then do them in order.",
  scene: "desk",
  kind: "type",
  icon: "♟️",
  hint: "What do you need to find first? Then what happens next?",
  tag: "stops_after_first_step",
  rounds: [
    { say: "Two steps. Key in the final answer.", q: "Mia buys 4 packs of 6 pencils and gives away 5 pencils. How many does she have?", ans: 19, trap: 24, why: "24 is how many she bought. She still gave 5 away.", win: "4 × 6 = 24, then 24 − 5 = 19." },
    { say: "Two steps again.", q: "Sam has 30 stickers. He puts 6 on each of 3 pages. How many are left?", ans: 12, trap: 18, why: "18 is how many he used. Take that from 30.", win: "3 × 6 = 18, then 30 − 18 = 12." },
    { say: "Solve both steps by yourself.", alt: [{ q: "5 boxes hold 8 crayons each. 7 crayons break. How many good crayons are there?", ans: 33, trap: 40 }, { q: "Tia saves 9 dollars a week for 4 weeks, then spends 10 dollars. How many dollars are left?", ans: 26, trap: 36 }] },
  ],
}));
