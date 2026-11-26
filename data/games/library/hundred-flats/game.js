// Hundred Flats. Skill 2.NBT.A.1-2.
// Hundreds numbers as groups of hundreds with no tens or ones: 300 is 3 hundreds. Using the tens dial (3 tens) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Hundred Flats",
  emoji: "🟨",
  premise: "Build numbers like 300 and 600 with big hundred flats. No rods and no cubes needed.",
  outro: "Numbers like 300 are a number of hundreds, with 0 tens and 0 ones.",
  scene: "desk",
  kind: "dial",
  cast: "",
  view: "tens",
  dials: [["Hundreds", 0, 9, 1, 0], ["Tens", 0, 9, 1, 0], ["Ones", 0, 9, 1, 0]],
  hint: "Count by hundreds: 100, 200, 300. How many flats?",
  tag: "uses_tens_for_hundreds",
  rounds: [
    { say: "Build 300 with hundred flats.", ans: [3, 0, 0], trap: [0, 3, 0], why: "3 tens is only 30. Three hundred is 3 hundreds.", win: "3 hundreds make 300." },
    { say: "Build 600.", ans: [6, 0, 0], trap: [0, 6, 0], why: "6 tens is only 60. Six hundred is 6 hundreds.", win: "6 hundreds make 600." },
    { say: "Build this number by yourself.", alt: [{ say: "Build 500 by yourself.", ans: [5, 0, 0], trap: [0, 5, 0] }, { say: "Build 800 by yourself.", ans: [8, 0, 0], trap: [0, 8, 0] }] },
  ],
}));
