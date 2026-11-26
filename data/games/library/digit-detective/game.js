// Digit Detective. Skill 1.NBT.B.2-4.
// The value of each digit in a two-digit number: the 3 in 37 is worth 30. Saying it is worth 3 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Digit Detective",
  emoji: "🔎",
  premise: "A digit is worth more when it sits in the tens place. Find out what each digit is really worth.",
  outro: "A digit in the tens place is worth that many tens.",
  scene: "paper",
  kind: "fill",
  cast: "",
  hint: "A digit in the tens place counts tens: 1 ten is 10, 3 tens is 30.",
  tag: "tens_digit_worth_its_face",
  rounds: [
    { say: "What is each digit worth? Drag the value in.", rows: [["In 37, the 3 is worth ___", "30"], ["In 37, the 7 is worth ___", "7"]], extra: "3 70", trap: [0, "3"], why: "The 3 is in the tens place. 3 tens is 30.", win: "37 is 30 and 7." },
    { say: "Now look at 52.", rows: [["In 52, the 5 is worth ___", "50"], ["In 52, the 2 is worth ___", "2"]], extra: "5 20", trap: [0, "5"], why: "The 5 is in the tens place. 5 tens is 50.", win: "52 is 50 and 2." },
    { say: "Find each value by yourself.", rows: [["In 84, the 8 is worth ___", "80"], ["In 84, the 4 is worth ___", "4"], ["In 19, the 1 is worth ___", "10"]], extra: "8 1 40", trap: [0, "8"] },
  ],
}));
