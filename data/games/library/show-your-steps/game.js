// Show Your Steps. Skill 1.NBT.C.4-4.
// Explaining an addition strategy with a model: the child orders the steps of adding with tens and ones. Trading before the ones are added is the known slip.
Sidekick.game(Sidekick.play({
  title: "Show Your Steps",
  emoji: "📝",
  premise: "A good helper can show how the adding was done. Put the steps with the blocks in the order they happen.",
  outro: "Add the ones, trade ten ones for a ten, then count the tens and ones.",
  scene: "paper",
  kind: "row",
  cast: "",
  hint: "You can only trade once you have 10 or more ones.",
  tag: "trades_before_adding",
  rounds: [
    { say: "Put the steps in the order they happen.", seq: "Start: 27 + 5|7 ones + 5 ones = 12 ones|Trade 10 ones for 1 ten|3 tens and 2 ones = 32", trap: "Start: 27 + 5|Trade 10 ones for 1 ten|7 ones + 5 ones = 12 ones|3 tens and 2 ones = 32", why: "You cannot trade until you have 10 or more ones. Add the ones first.", win: "Add the ones, trade, then read the total." },
    { say: "Order the steps for this one.", seq: "Start: 36 + 8|6 ones + 8 ones = 14 ones|Trade 10 ones for 1 ten|4 tens and 4 ones = 44", trap: "Start: 36 + 8|Trade 10 ones for 1 ten|6 ones + 8 ones = 14 ones|4 tens and 4 ones = 44", why: "Add the ones first. Then there are enough to trade.", win: "36 + 8 = 44." },
    { say: "Order these steps by yourself.", alt: [{ seq: "Start: 48 + 7|8 ones + 7 ones = 15 ones|Trade 10 ones for 1 ten|5 tens and 5 ones = 55", trap: "Start: 48 + 7|Trade 10 ones for 1 ten|8 ones + 7 ones = 15 ones|5 tens and 5 ones = 55" }, { seq: "Start: 19 + 6|9 ones + 6 ones = 15 ones|Trade 10 ones for 1 ten|2 tens and 5 ones = 25", trap: "Start: 19 + 6|Trade 10 ones for 1 ten|9 ones + 6 ones = 15 ones|2 tens and 5 ones = 25" }] },
  ],
}));
