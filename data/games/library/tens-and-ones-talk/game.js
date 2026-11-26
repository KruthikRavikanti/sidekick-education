// Tens and Ones Talk. Skill 2.NBT.B.9-1.
// Explaining an addition strategy with place value: split both numbers, add tens and ones, then combine. Combining before both places are added is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tens and Ones Talk",
  emoji: "💬",
  premise: "Explain how the adding works by putting the steps in order: split, add each place, then put it back together.",
  outro: "Splitting numbers into tens and ones shows why the adding works.",
  scene: "paper",
  kind: "row",
  cast: "",
  hint: "You can only put it together after both the tens and the ones are added.",
  tag: "combines_too_early",
  rounds: [
    { say: "Put the steps for 46 + 37 in order.", seq: "Split: 40 + 6 and 30 + 7|Add the tens: 40 + 30 = 70|Add the ones: 6 + 7 = 13|Put together: 70 + 13 = 83", also: ["Split: 40 + 6 and 30 + 7|Add the ones: 6 + 7 = 13|Add the tens: 40 + 30 = 70|Put together: 70 + 13 = 83"], trap: "Split: 40 + 6 and 30 + 7|Add the tens: 40 + 30 = 70|Put together: 70 + 13 = 83|Add the ones: 6 + 7 = 13", why: "You need the 13 from the ones before you can put it together.", win: "Split, add each place, put together." },
    { say: "Put the steps for 58 + 26 in order.", seq: "Split: 50 + 8 and 20 + 6|Add the tens: 50 + 20 = 70|Add the ones: 8 + 6 = 14|Put together: 70 + 14 = 84", also: ["Split: 50 + 8 and 20 + 6|Add the ones: 8 + 6 = 14|Add the tens: 50 + 20 = 70|Put together: 70 + 14 = 84"], trap: "Split: 50 + 8 and 20 + 6|Add the tens: 50 + 20 = 70|Put together: 70 + 14 = 84|Add the ones: 8 + 6 = 14", why: "You need the 14 from the ones before you can put it together.", win: "58 + 26 = 84." },
    { say: "Order the steps by yourself.", alt: [{ seq: "Split: 30 + 5 and 40 + 9|Add the tens: 30 + 40 = 70|Add the ones: 5 + 9 = 14|Put together: 70 + 14 = 84", also: ["Split: 30 + 5 and 40 + 9|Add the ones: 5 + 9 = 14|Add the tens: 30 + 40 = 70|Put together: 70 + 14 = 84"], trap: "Split: 30 + 5 and 40 + 9|Add the tens: 30 + 40 = 70|Put together: 70 + 14 = 84|Add the ones: 5 + 9 = 14" }, { seq: "Split: 20 + 7 and 60 + 4|Add the tens: 20 + 60 = 80|Add the ones: 7 + 4 = 11|Put together: 80 + 11 = 91", also: ["Split: 20 + 7 and 60 + 4|Add the ones: 7 + 4 = 11|Add the tens: 20 + 60 = 80|Put together: 80 + 11 = 91"], trap: "Split: 20 + 7 and 60 + 4|Add the tens: 20 + 60 = 80|Put together: 80 + 11 = 91|Add the ones: 7 + 4 = 11" }] },
  ],
}));
