// Ten Times the Place. Skill 4.NBT.A.1-2.
// Using division to compare place values: 700 ÷ 70 = 10 because the hundreds place is ten times the tens place. Subtracting instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "Ten Times the Place",
  emoji: "🏢",
  premise: "Each floor of the place value building is worth ten times the floor to its right. Use division to see it.",
  outro: "A digit in one place is worth ten times what it is worth one place to the right.",
  scene: "city",
  kind: "fill",
  cast: "",
  hint: "How many 70s fit into 700? Count by 70.",
  tag: "subtracts_instead",
  rounds: [
    { say: "Compare the places.", rows: [["A 7 in the hundreds is ___ times a 7 in the tens", "10"], ["700 ÷ 70 = ___", "10"]], extra: "100 630", trap: [1, "630"], why: "630 is 700 − 70. Division asks how many 70s are in 700.", win: "Ten times, both ways." },
    { say: "Two places apart is different.", rows: [["5,000 ÷ 500 = ___", "10"], ["300 ÷ 3 = ___", "100"]], extra: "4500 30", trap: [1, "30"], why: "From the hundreds to the ones is two places: 10 × 10.", win: "One place is 10 times. Two places is 100 times." },
    { say: "Finish these by yourself.", rows: [["9,000 ÷ 900 = ___", "10"], ["60 ÷ 6 = ___", "10"], ["8,000 ÷ 80 = ___", "100"]], extra: "1000 54", trap: [1, "54"] },
  ],
}));
