// Flashlight Find. Skill 3.OA.A.4-2.
// Finding the unknown in division equations with the unknown in different places. Dividing the two numbers that are shown is the known slip.
Sidekick.game(Sidekick.play({
  title: "Flashlight Find",
  emoji: "🔦",
  premise: "Part of each division fact is hidden in the dark. Shine the light on the number that belongs there.",
  outro: "Check a missing number by putting it back in the fact.",
  scene: "night",
  kind: "fill",
  cast: "",
  hint: "Put your number in the blank and read the whole fact. Is it true?",
  tag: "divides_the_two_numbers",
  rounds: [
    { say: "Drag in the hidden number.", rows: [["___ ÷ 2 = 6", "12"], ["18 ÷ ___ = 3", "6"]], extra: "3 54", trap: [0, "3"], why: "Check it: 3 ÷ 2 is not 6. What number split into 2 groups gives 6 in each?", win: "12 ÷ 2 = 6 and 18 ÷ 6 = 3." },
    { say: "Two more hidden numbers.", rows: [["___ ÷ 4 = 8", "32"], ["45 ÷ ___ = 9", "5"]], extra: "2 36", trap: [0, "2"], why: "Check it: 2 ÷ 4 is not 8. What number split into 4 groups gives 8 in each?", win: "32 ÷ 4 = 8 and 45 ÷ 5 = 9." },
    { say: "Find these by yourself.", rows: [["___ ÷ 3 = 9", "27"], ["56 ÷ ___ = 8", "7"], ["___ ÷ 5 = 10", "50"]], extra: "3 2 48", trap: [0, "3"] },
  ],
}));
