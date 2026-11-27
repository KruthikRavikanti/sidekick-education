// Cube Adder. Skill 1.NBT.C.4-1.
// Adding a two-digit and a one-digit number: the ones are added to the ones. Adding the single digit to the tens digit (34 + 5 = 84) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Cube Adder",
  emoji: "🧱",
  premise: "Add a few ones to a bigger number by building the total with rods and cubes. Ones join ones.",
  outro: "When you add ones, only the ones place changes.",
  scene: "desk",
  kind: "dial",
  cast: "",
  hint: "The small number is ones. It joins the ones, not the tens.",
  tag: "adds_ones_to_tens",
  dials: [["Tens", 0, 9], ["Ones", 0, 9]],
  view: "tens",
  rounds: [
    { say: "34 + 5. Build the total. The 5 joins the ones.", ans: [3, 9], trap: [8, 4], why: "The 5 is 5 ones. It joins the 4 ones, not the tens.", win: "34 + 5 = 39." },
    { say: "52 + 4. Build the total.", ans: [5, 6], trap: [9, 2], why: "The 4 is 4 ones. It joins the 2 ones.", win: "52 + 4 = 56." },
    { say: "Build the total by yourself.", alt: [{ say: "23 + 6. Build the total by yourself.", ans: [2, 9], trap: [8, 3] }, { say: "41 + 5. Build the total by yourself.", ans: [4, 6], trap: [9, 1] }, { say: "62 + 3. Build the total by yourself.", ans: [6, 5], trap: [9, 2] }] },
  ],
}));
