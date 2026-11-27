// Ten Rod Express. Skill 1.NBT.C.4-2.
// Adding a two-digit number and a multiple of ten: the tens are added to the tens. Adding them to the ones place (34 + 20 = 36) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Ten Rod Express",
  emoji: "🚄",
  premise: "The express train only carries whole tens. Add tens to a number and watch which place changes.",
  outro: "When you add tens, only the tens place changes.",
  scene: "field",
  kind: "dial",
  cast: "",
  hint: "20 is 2 tens. Add them to the tens.",
  tag: "adds_tens_to_ones",
  dials: [["Tens", 0, 9], ["Ones", 0, 9]],
  view: "tens",
  rounds: [
    { say: "34 + 20. Build the total. 20 is 2 tens.", ans: [5, 4], trap: [3, 6], why: "20 is 2 tens, not 2 ones. Add 2 ten rods.", win: "34 + 20 = 54." },
    { say: "45 + 30. Build the total.", ans: [7, 5], trap: [4, 8], why: "30 is 3 tens. Add 3 ten rods.", win: "45 + 30 = 75." },
    { say: "Build the total by yourself.", alt: [{ say: "23 + 40. Build the total by yourself.", ans: [6, 3], trap: [2, 7] }, { say: "51 + 20. Build the total by yourself.", ans: [7, 1], trap: [5, 3] }, { say: "32 + 60. Build the total by yourself.", ans: [9, 2], trap: [3, 8] }] },
  ],
}));
