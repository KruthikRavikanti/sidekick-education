// Two-Step Trail. Skill 2.OA.A.1-2.
// Two-step word problems: the answer to the first step is used in the second. Stopping after the first step is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two-Step Trail",
  emoji: "👣",
  premise: "These stories take two steps to solve. Follow the trail all the way to the end before you answer.",
  outro: "Some problems need two steps. Finish both.",
  scene: "forest",
  kind: "type",
  icon: "🥾",
  hint: "Do the first part. Then use that number for the second part.",
  tag: "stops_after_first_step",
  rounds: [
    { say: "Two things happen. Key in how many at the end.", q: "Tia had 24 beads. She got 18 more, then gave away 10. How many now?", ans: 32, trap: 42, why: "42 is after the first step. She still gave away 10.", win: "24 + 18 = 42, then 42 − 10 = 32." },
    { say: "Follow both steps.", q: "A bus has 35 riders. 12 get off and then 9 get on. How many riders now?", ans: 32, trap: 23, why: "23 is after riders got off. Then 9 more got on.", win: "35 − 12 = 23, then 23 + 9 = 32." },
    { say: "Solve both steps by yourself.", alt: [{ q: "Sam had 50 cents. He spent 20 cents and then found 15 cents. How many cents now?", ans: 45, trap: 30 }, { q: "A shelf has 28 books. 14 more are added, then 6 are borrowed. How many books now?", ans: 36, trap: 42 }] },
  ],
}));
