// Hidden Pattern. Skill 4.OA.C.5-2.
// Identifying features of a pattern that were not explicit in the rule, such as all terms being odd.
Sidekick.game(Sidekick.play({
  title: "Hidden Pattern",
  emoji: "🎩",
  premise: "A rule makes a pattern, and the pattern has secrets the rule never mentioned. Find what else is true.",
  outro: "Patterns have features beyond their rule, like being all odd or switching between odd and even.",
  scene: "night",
  kind: "pick",
  hint: "Look at every number in the list. What do they all share?",
  tag: "sees_only_the_rule",
  rounds: [
    { say: "Tap everything that is true about the pattern.", q: "Start at 3, add 4: 3, 7, 11, 15, 19", yes: "Every number is odd|They go up by 4 each time", no: "Every number is even|They are all multiples of 4|They switch between odd and even", trap: "They switch between odd and even", why: "Check each one: 3, 7, 11, 15, 19 are all odd.", win: "Adding 4 to an odd number keeps it odd." },
    { say: "Tap everything that is true about the pattern.", q: "Start at 1, add 3: 1, 4, 7, 10, 13", yes: "They switch between odd and even|They go up by 3 each time", no: "Every number is odd|They are all multiples of 3|Every number is even", trap: "Every number is odd", why: "4 and 10 are even. The numbers take turns.", win: "Adding 3 flips odd to even and back." },
    { say: "Tap everything that is true about the pattern.", q: "Start at 6, add 6: 6, 12, 18, 24, 30", yes: "Every number is even|They are all multiples of 6|They are all multiples of 3", no: "Every number is odd|They switch between odd and even|They all end in 6", trap: "They all end in 6" },
  ],
}));
