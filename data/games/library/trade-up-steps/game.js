// Trade Up Steps. Skill 2.NBT.B.7-3.
// Showing three-digit addition with a model: the steps are ordered from ones to tens to hundreds, with the trades explained. Starting from the hundreds loses the trades.
Sidekick.game(Sidekick.play({
  title: "Trade Up Steps",
  emoji: "🪜",
  premise: "Show where the new ten and the new hundred come from. Put the steps of the adding in order.",
  outro: "Ten ones are traded for a ten, and ten tens are traded for a hundred.",
  scene: "paper",
  kind: "row",
  cast: "",
  hint: "Start with the ones. Trade whenever a place reaches 10.",
  tag: "steps_out_of_order",
  rounds: [
    { say: "Put the steps in order.", seq: "Start: 245 + 178|5 + 8 = 13 ones, so trade 10 ones for a ten|1 + 4 + 7 = 12 tens, so trade 10 tens for a hundred|1 + 2 + 1 = 4 hundreds. The total is 423", trap: "Start: 245 + 178|1 + 4 + 7 = 12 tens, so trade 10 tens for a hundred|5 + 8 = 13 ones, so trade 10 ones for a ten|1 + 2 + 1 = 4 hundreds. The total is 423", why: "The extra ten comes from the ones. Add the ones first.", win: "Ones, then tens, then hundreds." },
    { say: "Order the steps for this one.", seq: "Start: 367 + 255|7 + 5 = 12 ones, so trade 10 ones for a ten|1 + 6 + 5 = 12 tens, so trade 10 tens for a hundred|1 + 3 + 2 = 6 hundreds. The total is 622", trap: "Start: 367 + 255|1 + 6 + 5 = 12 tens, so trade 10 tens for a hundred|7 + 5 = 12 ones, so trade 10 ones for a ten|1 + 3 + 2 = 6 hundreds. The total is 622", why: "The extra ten comes from the ones. Add the ones first.", win: "367 + 255 = 622." },
    { say: "Order these steps by yourself.", alt: [{ seq: "Start: 158 + 264|8 + 4 = 12 ones, so trade 10 ones for a ten|1 + 5 + 6 = 12 tens, so trade 10 tens for a hundred|1 + 1 + 2 = 4 hundreds. The total is 422", trap: "Start: 158 + 264|1 + 5 + 6 = 12 tens, so trade 10 tens for a hundred|8 + 4 = 12 ones, so trade 10 ones for a ten|1 + 1 + 2 = 4 hundreds. The total is 422" }, { seq: "Start: 479 + 136|9 + 6 = 15 ones, so trade 10 ones for a ten|1 + 7 + 3 = 11 tens, so trade 10 tens for a hundred|1 + 4 + 1 = 6 hundreds. The total is 615", trap: "Start: 479 + 136|1 + 7 + 3 = 11 tens, so trade 10 tens for a hundred|9 + 6 = 15 ones, so trade 10 ones for a ten|1 + 4 + 1 = 6 hundreds. The total is 615" }] },
  ],
}));
