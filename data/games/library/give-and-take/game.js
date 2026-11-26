// Give and Take. Skill 2.NBT.B.9-2.
// Explaining a strategy with properties: 38 + 25 equals 40 + 23 because 2 moves from one addend to the other. Keeping the second addend unchanged is the known slip.
Sidekick.game(Sidekick.play({
  title: "Give and Take",
  emoji: "🤲",
  premise: "Slide a little from one number to the other to make a tidy ten. The total stays the same.",
  outro: "Moving some from one number to the other does not change the total.",
  scene: "candy",
  kind: "fill",
  cast: "",
  hint: "If one number goes up by 2, the other must go down by 2.",
  tag: "changes_only_one_number",
  rounds: [
    { say: "Make the first number a tidy ten. What does the other become?", rows: [["38 + 25 = 40 + ___", "23"], ["49 + 16 = 50 + ___", "15"]], extra: "25 16 27", trap: [0, "25"], why: "2 moved over to make 40, so the other number is 2 smaller.", win: "40 + 23 and 50 + 15." },
    { say: "Give and take again.", rows: [["27 + 35 = 30 + ___", "32"], ["58 + 14 = 60 + ___", "12"]], extra: "35 14 38", trap: [0, "35"], why: "3 moved over to make 30, so the other number is 3 smaller.", win: "30 + 32 and 60 + 12." },
    { say: "Finish these by yourself.", rows: [["19 + 43 = 20 + ___", "42"], ["68 + 27 = 70 + ___", "25"], ["39 + 55 = 40 + ___", "54"]], extra: "43 27 56", trap: [0, "43"] },
  ],
}));
