// Tens Tower. Skill 1.NBT.B.2-3.
// Decade numbers as groups of tens: 50 is 5 tens and 0 ones. Setting the ones dial to 5 instead of the tens dial is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tens Tower",
  emoji: "🗼",
  premise: "Build each number with ten rods standing side by side. These numbers need no loose ones at all.",
  outro: "Numbers like 30, 50 and 70 are groups of tens with zero ones.",
  scene: "city",
  kind: "dial",
  cast: "",
  hint: "Count by tens: 10, 20, 30. How many rods is that?",
  tag: "uses_ones_for_tens",
  dials: [["Tens", 0, 9], ["Ones", 0, 9]],
  view: "tens",
  rounds: [
    { say: "Build 30 with ten rods.", ans: [3, 0], trap: [0, 3], why: "3 ones is only 3. Thirty is 3 tens.", win: "3 tens make 30." },
    { say: "Build 70.", ans: [7, 0], trap: [0, 7], why: "7 ones is only 7. Seventy is 7 tens.", win: "7 tens make 70." },
    { say: "Build this number by yourself.", alt: [{ say: "Build 50 by yourself.", ans: [5, 0], trap: [0, 5] }, { say: "Build 90 by yourself.", ans: [9, 0], trap: [0, 9] }, { say: "Build 40 by yourself.", ans: [4, 0], trap: [0, 4] }] },
  ],
}));
