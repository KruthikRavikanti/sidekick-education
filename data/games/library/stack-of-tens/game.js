// Stack of Tens. Skill 3.NBT.A.3-2.
// Using place value to explain a product: 5 × 30 is 15 tens, built as 1 hundred and 5 tens. Building only 15 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Stack of Tens",
  emoji: "📚",
  premise: "A product like 5 × 30 is a pile of ten rods. Build it with blocks to see why it is so big.",
  outro: "5 × 30 is 15 tens, and 15 tens is 150.",
  scene: "desk",
  kind: "dial",
  cast: "",
  view: "tens",
  dials: [["Hundreds", 0, 9, 1, 0], ["Tens", 0, 9, 1, 0], ["Ones", 0, 9, 1, 0]],
  hint: "How many tens is it? Ten of those tens make a hundred.",
  tag: "forgets_the_tens",
  rounds: [
    { say: "4 × 20 is 8 tens. Build it.", ans: [0, 8, 0], trap: [0, 0, 8], why: "8 ones is only 8. The product is 8 tens.", win: "8 tens is 80." },
    { say: "5 × 30 is 15 tens. Build it with the fewest blocks.", ans: [1, 5, 0], trap: [0, 1, 5], why: "That is 15, not 15 tens. 15 tens is 1 hundred and 5 tens.", win: "15 tens is 150." },
    { say: "Build the product by yourself.", alt: [{ say: "6 × 40 is 24 tens. Build it with the fewest blocks.", ans: [2, 4, 0], trap: [0, 2, 4] }, { say: "7 × 50 is 35 tens. Build it with the fewest blocks.", ans: [3, 5, 0], trap: [0, 3, 5] }] },
  ],
}));
