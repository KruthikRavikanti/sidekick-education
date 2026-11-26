// Backward Bunny. Skill 1.OA.C.5-2.
// Counting back to subtract small numbers: counting the starting number as the first step back ends one too high.
Sidekick.game(Sidekick.play({
  title: "Backward Bunny",
  emoji: "🐇",
  premise: "The bunny hops backward to take away. Each hop back is one less.",
  outro: "Counting back takes away. The first hop lands on the number before.",
  scene: "meadow",
  kind: "line",
  cast: "🥕 🌱 🥕",
  hint: "The first hop back lands on the number just before.",
  tag: "counts_the_start",
  line: [0, 20, 1],
  icon: "🐇",
  rounds: [
    { say: "12 − 3. Start on 12 and hop back 3.", from: 12, ans: 9, trap: 10, why: "The first hop back lands on 11. Then 10, then 9.", win: "11, 10, 9. So 12 − 3 = 9." },
    { say: "15 − 2. Start on 15 and hop back 2.", from: 15, ans: 13, trap: 14, why: "The first hop back lands on 14. One more hop.", win: "14, 13. So 15 − 2 = 13." },
    { say: "Hop back by yourself.", alt: [{ say: "11 − 3. Start on 11 and hop back 3.", from: 11, ans: 8, trap: 9 }, { say: "14 − 2. Start on 14 and hop back 2.", from: 14, ans: 12, trap: 13 }, { say: "17 − 3. Start on 17 and hop back 3.", from: 17, ans: 14, trap: 15 }] },
  ],
}));
