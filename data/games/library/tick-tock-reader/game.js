// Tick Tock Reader. Skill 1.MD.B.3-2.
// Reading half past the hour: the hour hand sits between two numbers, and the hour is the one it has passed. Reading the next hour (8:30 for 7:30) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tick Tock Reader",
  emoji: "🕢",
  premise: "The clock shows a time at half past the hour. Read the hands and set the same time in numbers.",
  outro: "At half past, the short hand is halfway to the next number. The hour is the one it has already passed.",
  scene: "kitchen",
  kind: "dial",
  cast: "",
  hint: "The short hand has passed one number and is on its way to the next. Use the one it passed.",
  tag: "reads_the_next_hour",
  dials: [["Hour", 1, 12], ["Minutes", 0, 30, 30]],
  view: { type: "text", text: "{0}:{1:2}" },
  rounds: [
    { say: "Read the clock. Set the same time in numbers.", fig: { type: "clock", v: [7, 30], w: 46 }, ans: [7, 30], trap: [8, 30], why: "The short hand is between 7 and 8. It has passed 7, not reached 8.", win: "Half past 7 is 7:30." },
    { say: "What time is it?", fig: { type: "clock", v: [2, 30], w: 46 }, ans: [2, 30], trap: [3, 30], why: "The short hand is between 2 and 3. It has passed 2.", win: "Half past 2 is 2:30." },
    { say: "Read this clock by yourself.", alt: [{ fig: { type: "clock", v: [10, 30], w: 46 }, ans: [10, 30], trap: [11, 30] }, { fig: { type: "clock", v: [4, 30], w: 46 }, ans: [4, 30], trap: [5, 30] }, { fig: { type: "clock", v: [9, 30], w: 46 }, ans: [9, 30], trap: [10, 30] }] },
  ],
}));
