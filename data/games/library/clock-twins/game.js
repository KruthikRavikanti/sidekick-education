// Clock Twins. Skill 1.MD.B.3-3.
// Matching analog and digital times to the hour and half hour: the child tags each clock face with its digital time. Reading the 6 the long hand points to as the hour is a common slip.
Sidekick.game(Sidekick.play({
  title: "Clock Twins",
  emoji: "🕰️",
  premise: "Every clock with hands has a twin that shows the same time in numbers. Match each pair.",
  outro: "The time on a clock with hands can be written with numbers, like 3:30.",
  scene: "night",
  kind: "fill",
  cast: "",
  hint: "The short hand tells the hour. The long hand on 6 means 30 minutes.",
  tag: "reads_long_hand_as_hour",
  rounds: [
    { say: "Drag the matching time under each clock.", rows: [["~clock:3:30", "3:30"], ["~clock:6:00", "6:00"]], extra: "6:30", trap: [0, "6:30"], why: "The short hand is past 3. The long hand on 6 means 30 minutes.", win: "3:30 and 6:00." },
    { say: "Three clocks to match.", rows: [["~clock:9:30", "9:30"], ["~clock:1:00", "1:00"], ["~clock:11:30", "11:30"]], extra: "6:09", trap: [0, "6:09"], why: "The short hand tells the hour: it is past 9.", win: "9:30, 1:00 and 11:30." },
    { say: "Match these clocks by yourself.", rows: [["~clock:5:30", "5:30"], ["~clock:8:00", "8:00"], ["~clock:12:30", "12:30"]], extra: "6:05 12:00", trap: [0, "6:05"] },
  ],
}));
