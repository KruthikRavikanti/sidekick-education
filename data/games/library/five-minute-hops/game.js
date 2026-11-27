// Five-Minute Hops. Skill 2.MD.C.7-1.
// Reading the minute hand in five-minute steps: the hand on 3 means 15 minutes. Reading the number it points to as the minutes is the known slip.
Sidekick.game(Sidekick.play({
  title: "Five-Minute Hops",
  emoji: "⏱️",
  premise: "The long hand hops five minutes for every number it passes. Read the clock and set the time in numbers.",
  outro: "Each number on the clock is 5 more minutes: 5, 10, 15, 20...",
  scene: "kitchen",
  kind: "dial",
  cast: "",
  dials: [["Hour", 1, 12], ["Minutes", 0, 59]],
  view: { type: "text", text: "{0}:{1:2}" },
  hint: "Count by fives around the clock to where the long hand points.",
  tag: "reads_number_as_minutes",
  rounds: [
    { say: "Read the clock. Set the same time in numbers.", fig: { type: "clock", v: [2, 15], w: 46 }, ans: [2, 15], trap: [2, 3], why: "The long hand on 3 means 3 hops of five: 5, 10, 15 minutes.", win: "2:15." },
    { say: "What time is it?", fig: { type: "clock", v: [7, 40], w: 46 }, ans: [7, 40], trap: [7, 8], why: "The long hand on 8 means 8 hops of five: 40 minutes.", win: "7:40." },
    { say: "Read this clock by yourself.", alt: [{ fig: { type: "clock", v: [4, 25], w: 46 }, ans: [4, 25], trap: [4, 5] }, { fig: { type: "clock", v: [10, 50], w: 46 }, ans: [10, 50], trap: [10, 10] }] },
  ],
}));
