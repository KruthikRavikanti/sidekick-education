// Snail Trail. Skill K.CC.A.2-2.
// Counting forward across a decade from a given start: the snail slides on from numbers like 38, and counting the start again lands one short.
Sidekick.game(Sidekick.play({
  title: "Snail Trail",
  emoji: "🐌",
  premise: "The snail is partway down its trail. Slide it on, right past the place where the tens change.",
  outro: "The snail slid right past the new ten without getting lost.",
  scene: "forest",
  kind: "line",
  cast: "🍄 🌿 🍂 🌿",
  hint: "Do not count the starting number again. The first slide lands on the next number.",
  tag: "counts_the_start",
  line: [20, 45, 1, 5],
  icon: "🐌",
  rounds: [
    { say: "The snail is on 27. Slide it 5 more.", from: 27, ans: 32, trap: 31, why: "The first slide lands on 28. Keep going: 29, 30, 31, 32.", win: "28, 29, 30, 31, 32!" },
    { say: "The snail is on 38. Slide it 4 more.", from: 38, ans: 42, trap: 41, why: "The first slide lands on 39. Then 40, 41, 42.", win: "39, 40, 41, 42!" },
    { say: "Slide the snail by yourself.", alt: [{ say: "The snail is on 29. Slide it 3 more.", from: 29, ans: 32, trap: 31 }, { say: "The snail is on 39. Slide it 4 more.", from: 39, ans: 43, trap: 42 }, { say: "The snail is on 37. Slide it 6 more.", from: 37, ans: 43, trap: 42 }] },
  ],
}));
