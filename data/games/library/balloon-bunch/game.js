// Balloon Bunch. Skill 1.OA.A.2-1.
// Adding three numbers with a sum up to 20. Adding only two of the three is the known slip, so the trap is the sum of the first two.
Sidekick.game(Sidekick.play({
  title: "Balloon Bunch",
  emoji: "🎈",
  premise: "Three colors of balloons are tied into one bunch. Add all three groups to find the whole bunch.",
  outro: "When there are three numbers, all three get added.",
  scene: "sky",
  kind: "type",
  icon: "🎈",
  hint: "Add two of the numbers, then add the third one.",
  tag: "adds_only_two",
  rounds: [
    { say: "How many balloons are in the bunch?", pic: "🔴🔴🔴🔴 🔵🔵🔵🔵🔵🔵 🟢🟢🟢", q: "4 + 6 + 3", ans: 13, trap: 10, why: "That is only the red and blue ones. Add the green ones too.", win: "4 + 6 + 3 = 13." },
    { say: "Add all three numbers.", q: "5 + 2 + 8", ans: 15, trap: 7, why: "That is only the first two. There is one more number to add.", win: "5 + 2 + 8 = 15." },
    { say: "Add all three by yourself.", alt: [{ q: "3 + 7 + 6", ans: 16, trap: 10 }, { q: "6 + 5 + 4", ans: 15, trap: 11 }, { q: "8 + 2 + 7", ans: 17, trap: 10 }] },
  ],
}));
