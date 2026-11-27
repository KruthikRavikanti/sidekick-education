// Per and For Each. Skill 6.RP.A.2-2.
// Using rate language in the context of a ratio relationship. Not being able to say what one unit gets is the known slip.
Sidekick.game(Sidekick.play({
  title: "Per and For Each",
  emoji: "🥣",
  premise: "Rate language uses per and for each. It always tells what ONE unit gets.",
  outro: "A unit rate is read with per or for each: 3 cups per batch.",
  scene: "kitchen",
  kind: "fill",
  cast: "",
  hint: "Divide to find the amount for one. Then say it with per.",
  tag: "cannot_state_unit_rate",
  rounds: [
    { say: "Say each one as a unit rate.", rows: [["6 cups of flour make 2 batches", "3 cups per batch"], ["120 miles in 3 hours", "40 miles per hour"]], extra: "2 batches per cup|", trap: [0, "2 batches per cup"], why: "One batch does not get 2 of anything. Share 6 cups between 2 batches.", win: "3 cups per batch, 40 miles per hour." },
    { say: "Say each one as a unit rate.", rows: [["$15 for 5 pens", "$3 for each pen"], ["48 students on 2 buses", "24 students per bus"], ["200 words in 4 minutes", "50 words per minute"]], trap: [1, "50 words per minute"], why: "Share 48 students between 2 buses.", win: "Three unit rates." },
    { say: "Say these by yourself.", rows: [["$36 for 9 tickets", "$4 per ticket"], ["60 laps in 5 days", "12 laps per day"]], extra: "9 tickets per dollar|5 laps per day", trap: [0, "9 tickets per dollar"] },
  ],
}));
