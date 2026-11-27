// Time Line. Skill 3.MD.A.1-3.
// Solving time problems on a number line: each space is five minutes, and the end time is found by jumping the duration. Counting ticks instead of spaces lands five minutes early.
Sidekick.game(Sidekick.play({
  title: "Time Line",
  emoji: "🕓",
  premise: "Time can be a number line. Start at the starting time and jump ahead by how long it lasts.",
  outro: "On a time line, each space is the same number of minutes.",
  scene: "sky",
  kind: "line",
  cast: "",
  icon: "⏰",
  readout: true,
  hint: "Each space is 5 minutes. Count the spaces you jump, not the marks.",
  tag: "counts_ticks_not_spaces",
  rounds: [
    { say: "Soccer starts at 4:15 and lasts 50 minutes. Slide to the time it ends.", line: [0, 90, 5, 3], fmt: "clock:4", from: 15, ans: 65, trap: 60, why: "Count the spaces: 10 spaces of 5 minutes make 50.", win: "It ends at 5:05." },
    { say: "Art starts at 7:30 and lasts 40 minutes. Slide to the time it ends.", line: [0, 90, 5, 3], fmt: "clock:7", from: 30, ans: 70, trap: 65, why: "Count 8 spaces of 5 minutes from 7:30.", win: "It ends at 8:10." },
    { say: "Slide to the end time by yourself.", alt: [{ say: "A movie starts at 2:45 and lasts 35 minutes. Slide to the time it ends.", line: [0, 90, 5, 3], fmt: "clock:2", from: 45, ans: 80, trap: 75 }, { say: "Band starts at 9:10 and lasts 55 minutes. Slide to the time it ends.", line: [0, 90, 5, 3], fmt: "clock:9", from: 10, ans: 65, trap: 60 }] },
  ],
}));
