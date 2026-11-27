// Random Beats Convenient. Skill 7.SP.A.1-2.
// Understanding that random sampling tends to produce representative samples. Trusting convenience samples is the known slip.
Sidekick.game(Sidekick.play({
  title: "Random Beats Convenient",
  emoji: "🎩",
  premise: "Random sampling gives every member the same chance of being picked. That is what makes a sample trustworthy.",
  outro: "Random samples tend to represent the population. Convenience and volunteer samples often do not.",
  scene: "night",
  kind: "pick",
  fs: 5.2,
  hint: "Does every person have the same chance of being chosen?",
  tag: "trusts_convenience_sample",
  rounds: [
    { say: "Tap every method that gives each person an equal chance.", yes: "draw names from a hat|use a random number list|roll a die for each row", no: "ask whoever walks by|let people sign up|ask your friends", trap: "let people sign up", why: "People who choose to answer often feel strongly. That tilts the results.", win: "Three random methods." },
    { say: "Which results would you trust more?", kind: "sort", fs: 4.8, bins: "Trust more|Trust less", items: ["100 people picked at random|Every 20th name on a full list", "500 who chose to answer online|1,000 callers to a radio show"], trap: ["500 who chose to answer online", 0], why: "They picked themselves. 100 chosen at random tell you more.", win: "Random beats big." },
    { say: "Tap every random method by yourself.", yes: "pick ID numbers by computer|draw seat numbers from a bag", no: "survey the front row|post a poll online|ask the first 20 to arrive|ask people who look friendly", trap: "post a poll online" },
  ],
}));
