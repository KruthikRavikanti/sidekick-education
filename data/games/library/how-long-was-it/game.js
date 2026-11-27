// How Long Was It?. Skill 3.MD.A.1-2.
// Finding elapsed time in minutes, including across the hour. Subtracting clock times as plain numbers (2:10 − 1:50 = 60) is the known slip.
Sidekick.game(Sidekick.play({
  title: "How Long Was It?",
  emoji: "⏳",
  premise: "Something starts at one time and ends at another. Work out how many minutes went by.",
  outro: "To find how long, count from the start time to the end time.",
  scene: "desk",
  kind: "type",
  icon: "⏳",
  hint: "Count up to the next hour first, then count the rest.",
  tag: "subtracts_like_plain_numbers",
  rounds: [
    { say: "Key in how many minutes long it is.", q: "Recess starts at 10:15 and ends at 10:40.", ans: 25, trap: 55, why: "Count from 15 minutes to 40 minutes past ten.", win: "25 minutes." },
    { say: "This one crosses the hour.", q: "A show starts at 1:50 and ends at 2:10.", ans: 20, trap: 60, why: "From 1:50 to 2:00 is 10 minutes, then 10 more to 2:10.", win: "10 + 10 = 20 minutes." },
    { say: "Find how long by yourself.", alt: [{ q: "Lunch starts at 11:45 and ends at 12:20.", ans: 35, trap: 75 }, { q: "A bus ride goes from 3:40 to 4:05.", ans: 25, trap: 65 }] },
  ],
}));
