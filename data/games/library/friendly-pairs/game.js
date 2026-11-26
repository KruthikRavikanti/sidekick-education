// Friendly Pairs. Skill 2.NBT.B.6-2.
// Using properties to choose an easy order: the child picks the pair that makes a tidy ten number. Always taking the first two in order is the known slip.
Sidekick.game(Sidekick.play({
  title: "Friendly Pairs",
  emoji: "🤝",
  premise: "You may add in any order you like. Find the two numbers that go together easily and add them first.",
  outro: "Adding in a smart order makes the work easier.",
  scene: "candy",
  kind: "fill",
  cast: "",
  hint: "Which two ones digits make 10 together?",
  tag: "adds_left_to_right",
  rounds: [
    { say: "Which pair is easiest to add first? Drag it in.", rows: [["18 + 35 + 12", "18 + 12"], ["27 + 46 + 3", "27 + 3"]], extra: "18 + 35|27 + 46", trap: [0, "18 + 35"], why: "18 and 12 make 30, a tidy number. Start there.", win: "18 + 12 = 30 and 27 + 3 = 30." },
    { say: "Find the friendly pair in each.", rows: [["25 + 38 + 25", "25 + 25"], ["14 + 29 + 16", "14 + 16"]], extra: "25 + 38|14 + 29", trap: [0, "25 + 38"], why: "25 and 25 make 50. That is easier to start with.", win: "25 + 25 = 50 and 14 + 16 = 30." },
    { say: "Find the friendly pairs by yourself.", rows: [["33 + 48 + 7", "33 + 7"], ["45 + 19 + 15", "45 + 15"], ["21 + 64 + 9", "21 + 9"]], extra: "33 + 48|45 + 19", trap: [0, "33 + 48"] },
  ],
}));
