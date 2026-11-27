// Factor Pair Fishing. Skill 4.OA.B.4-1.
// Finding all factor pairs of a number: the child picks every pair whose product is the number. Missing a pair is the known slip.
Sidekick.game(Sidekick.play({
  title: "Factor Pair Fishing",
  emoji: "🎣",
  premise: "Every number hides pairs of factors that multiply to make it. Catch all of them, and leave the fakes in the water.",
  outro: "To find every factor pair, test 1, 2, 3 and so on until the pairs start to repeat.",
  scene: "ocean",
  kind: "pick",
  hint: "Try dividing by 1, 2, 3, 4... Each one that works gives a pair.",
  tag: "misses_a_factor_pair",
  rounds: [
    { say: "Tap every factor pair of 24.", yes: "1 × 24|2 × 12|3 × 8|4 × 6", no: "5 × 5|2 × 14|3 × 6", trap: "-3 × 8", why: "One pair is still missing. Try dividing 24 by 3.", win: "Four factor pairs of 24." },
    { say: "Tap every factor pair of 36.", yes: "1 × 36|2 × 18|3 × 12|4 × 9|6 × 6", no: "5 × 7|2 × 16|3 × 13", trap: "-4 × 9", why: "One pair is still missing. Try dividing 36 by 4.", win: "Five factor pairs of 36." },
    { say: "Tap every factor pair of 40.", yes: "1 × 40|2 × 20|4 × 10|5 × 8", no: "3 × 13|6 × 7|3 × 14", trap: "-5 × 8" },
  ],
}));
