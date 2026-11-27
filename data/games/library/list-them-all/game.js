// List Them All. Skill 7.SP.C.8-2.
// Representing sample spaces for compound events with lists, tables and tree diagrams. Missing outcomes is the known slip.
Sidekick.game(Sidekick.play({
  title: "List Them All",
  emoji: "📝",
  premise: "A sample space lists every possible outcome. Order matters: heads then tails is not the same as tails then heads.",
  outro: "A sample space has every outcome once, with order counted.",
  scene: "paper",
  kind: "pick",
  fs: 6.4,
  hint: "Go in order: fix the first result, then list everything the second can be.",
  tag: "misses_outcomes",
  rounds: [
    { say: "Tap every outcome of flipping two coins.", yes: "HH HT TH TT", no: "HHT T THH", trap: "-TH", why: "Heads then tails is a different outcome from tails then heads.", win: "Four outcomes." },
    { say: "A coin and a spinner with A, B, C. Key in how many outcomes there are.", kind: "type", icon: "📝", ans: 6, trap: 5, why: "Each of the 2 coin results pairs with all 3 letters: 2 × 3.", win: "HA, HB, HC, TA, TB, TC." },
    { say: "A coin and a spinner with A, B, C. Tap every outcome by yourself.", yes: "HA HB HC TA TB TC", no: "AB HT CC", trap: "-TC" },
  ],
}));
