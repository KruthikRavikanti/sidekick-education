// Between the Tens. Skill 3.NBT.A.1-1.
// Finding the two tens or hundreds a number lies between, the first step of rounding. Picking the wrong pair is the known slip.
Sidekick.game(Sidekick.play({
  title: "Between the Tens",
  emoji: "🚏",
  premise: "Every number sits between two tens, and between two hundreds. Plant a flag on each neighbor.",
  outro: "To round a number, first find the two tens or hundreds it sits between.",
  scene: "city",
  kind: "line",
  cast: "",
  pair: true,
  icon: "🚩",
  icon2: "🚩",
  hint: "Count by tens (or hundreds). Which two does the number fall between?",
  tag: "picks_the_next_pair",
  rounds: [
    { say: "Slide the two flags to the tens that 67 is between.", line: [40, 80, 10], marks: [[67, "67"]], from: [40, 80], ans: [60, 70], trap: [70, 80], why: "67 is more than 60 and less than 70.", win: "67 is between 60 and 70." },
    { say: "Slide the two flags to the hundreds that 348 is between.", line: [200, 600, 100], marks: [[348, "348"]], from: [200, 600], ans: [300, 400], trap: [400, 500], why: "348 is more than 300 and less than 400.", win: "348 is between 300 and 400." },
    { say: "Plant the flags by yourself.", alt: [{ say: "Slide the two flags to the tens that 32 is between.", line: [10, 60, 10], marks: [[32, "32"]], from: [10, 60], ans: [30, 40], trap: [20, 30] }, { say: "Slide the two flags to the hundreds that 752 is between.", line: [500, 900, 100], marks: [[752, "752"]], from: [500, 900], ans: [700, 800], trap: [800, 900] }] },
  ],
}));
