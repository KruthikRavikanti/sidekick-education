// Marble Bags. Skill 1.NBT.A.1-3.
// Representing a number of objects with a numeral: bags of ten are the tens digit and loose marbles the ones digit. Writing the digits in the other order is the known slip.
Sidekick.game(Sidekick.play({
  title: "Marble Bags",
  emoji: "🎒",
  premise: "Every bag holds exactly 10 marbles, and a few marbles are loose. Write how many marbles there are.",
  outro: "The bags of ten go in the tens place. The loose ones go in the ones place.",
  scene: "candy",
  kind: "row",
  cast: "",
  labels: "Tens Ones",
  hint: "Count the bags for the tens. Count the loose marbles for the ones.",
  tag: "swaps_tens_and_ones",
  q: "Each bag holds 10 marbles.",
  rounds: [
    { say: "How many marbles? Put the digits in the tens and ones places.", pic: "🎒🎒🎒 🔵🔵🔵🔵", seq: "3 4", extra: "7", trap: "4 3", why: "There are 3 bags of ten. The 3 goes in the tens place.", win: "3 tens and 4 ones is 34." },
    { say: "How many marbles this time?", pic: "🎒🎒🎒🎒🎒 🔵🔵", seq: "5 2", extra: "7", trap: "2 5", why: "There are 5 bags of ten. The 5 goes in the tens place.", win: "5 tens and 2 ones is 52." },
    { say: "Write the number by yourself.", alt: [{ pic: "🎒🎒 🔵🔵🔵🔵🔵🔵", seq: "2 6", extra: "8", trap: "6 2" }, { pic: "🎒🎒🎒🎒 🔵🔵🔵", seq: "4 3", extra: "7", trap: "3 4" }, { pic: "🎒🎒🎒🎒🎒🎒 🔵", seq: "6 1", extra: "7", trap: "1 6" }] },
  ],
}));
