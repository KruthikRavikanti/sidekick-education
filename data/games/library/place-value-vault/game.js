// Place Value Vault. Skill 2.NBT.A.1-3.
// The value of each digit in a three-digit number: the 4 in 482 is worth 400. Naming the digit itself as its value is the known slip.
Sidekick.game(Sidekick.play({
  title: "Place Value Vault",
  emoji: "🔐",
  premise: "The vault opens when you know what each digit is really worth. Hundreds, tens and ones all count differently.",
  outro: "A digit is worth more the further left it sits: hundreds, tens, ones.",
  scene: "city",
  kind: "fill",
  cast: "",
  hint: "Hundreds place means hundreds. Tens place means tens.",
  tag: "digit_worth_its_face",
  rounds: [
    { say: "What is each digit worth?", rows: [["In 482, the 4 is worth ___", "400"], ["In 482, the 8 is worth ___", "80"]], extra: "4 8", trap: [0, "4"], why: "The 4 is in the hundreds place. 4 hundreds is 400.", win: "400 and 80." },
    { say: "Now look at 715.", rows: [["In 715, the 7 is worth ___", "700"], ["In 715, the 1 is worth ___", "10"], ["In 715, the 5 is worth ___", "5"]], extra: "7 1", trap: [1, "1"], why: "The 1 is in the tens place. 1 ten is 10.", win: "700, 10 and 5." },
    { say: "Find each value by yourself.", rows: [["In 936, the 9 is worth ___", "900"], ["In 936, the 3 is worth ___", "30"], ["In 936, the 6 is worth ___", "6"]], extra: "9 3 300", trap: [0, "9"] },
  ],
}));
