// To the Minute. Skill 3.MD.A.1-1.
// Telling time to the nearest minute: count by fives to the last numeral and then by ones. Reading the nearby numeral as the minutes is the known slip.
Sidekick.game(Sidekick.play({
  title: "To the Minute",
  emoji: "⌚",
  premise: "Now the long hand stops between the numbers. Count by fives, then count the little marks, to read the exact minute.",
  outro: "Count by fives to the last number, then count on by ones.",
  scene: "desk",
  kind: "dial",
  cast: "",
  dials: [["Hour", 1, 12], ["Minutes", 0, 59]],
  view: { type: "text", text: "{0}:{1:2}" },
  hint: "Count by fives to the number before the long hand, then add the little marks.",
  tag: "reads_number_as_minutes",
  rounds: [
    { say: "Read the clock to the exact minute.", fig: { type: "clock", v: [9, 12], w: 46 }, ans: [9, 12], trap: [9, 2], why: "The long hand is 2 small marks past the 2. That is 10 and 2 more.", win: "9:12." },
    { say: "What time is it, to the minute?", fig: { type: "clock", v: [4, 37], w: 46 }, ans: [4, 37], trap: [4, 7], why: "Count by fives to the 7, which is 35, then 2 more marks.", win: "4:37." },
    { say: "Read this clock by yourself.", alt: [{ fig: { type: "clock", v: [11, 48], w: 46 }, ans: [11, 48], trap: [11, 9] }, { fig: { type: "clock", v: [2, 23], w: 46 }, ans: [2, 23], trap: [2, 4] }] },
  ],
}));
