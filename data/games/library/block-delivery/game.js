// Block Delivery. Skill K.CC.B.5-3.
// Counting out a requested number from a larger group: the child loads blocks and must stop at the target, with plenty of extra blocks left to tempt going past it.
Sidekick.game(Sidekick.play({
  title: "Block Delivery",
  emoji: "🏗️",
  premise: "The builders ask for an exact number of blocks. Load just that many, then stop.",
  outro: "You counted out just what was asked for and stopped.",
  scene: "city",
  kind: "build",
  cast: "🏗️ 🚚 🏢 👷",
  hint: "Count as you load. When you say the number they asked for, stop.",
  tag: "counts_past_target",
  pile: [["🧱", 1, 12]],
  rounds: [
    { say: "The builders need 5 blocks. Load exactly 5.", goal: 5, trap: 6, why: "That is one more than they asked for. Stop at 5.", win: "Exactly 5 blocks." },
    { say: "Now they need 8 blocks. Load exactly 8.", goal: 8, trap: 9, why: "That is one too many. Stop when you say 8.", win: "Exactly 8 blocks." },
    { say: "Load the order by yourself.", alt: [{ say: "The builders need 7 blocks. Load exactly 7.", goal: 7, trap: 8, trap2: 12 }, { say: "The builders need 9 blocks. Load exactly 9.", goal: 9, trap: 10, trap2: 12 }, { say: "The builders need 6 blocks. Load exactly 6.", goal: 6, trap: 7, trap2: 12 }] },
  ],
}));
