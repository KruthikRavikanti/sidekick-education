// And, Or, Not. Skill S-CP.A.1-1.
// Describing events as subsets of a sample space using unions, intersections and complements. Confusing or with and is the known slip.
Sidekick.game(Sidekick.play({
  title: "And, Or, Not",
  emoji: "🎲",
  premise: "Roll a die. \"Or\" collects every outcome in either event. \"And\" keeps only the ones in both.",
  outro: "A or B: in at least one. A and B: in both. Not A: everything outside A.",
  scene: "desk",
  kind: "pick",
  hint: "Or is generous: in A, in B, or in both. And is strict: must be in both.",
  tag: "or_as_and",
  rounds: [
    { say: "A is even. B is greater than 4. Tap every outcome in A or B.", yes: "2 4 5 6", no: "1 3", trap: "-2 -4 -5", why: "Only 6 is in both, and that is A and B. A or B takes every even number and every number over 4.", win: "A or B: 2, 4, 5, 6." },
    { say: "A is even. B is greater than 4. Tap every outcome that is not in A.", yes: "1 3 5", no: "2 4 6", trap: "-5", why: "5 is odd, so it is not in A, even though it is in B.", win: "Not A: 1, 3, 5." },
    { say: "By yourself: A is odd. B is less than 3. Tap every outcome in A or B.", yes: "1 2 3 5", no: "4 6", trap: "-2 -3 -5" },
  ],
}));
