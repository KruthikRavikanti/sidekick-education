// Kangaroo Count On. Skill 1.OA.C.5-1.
// Counting on from the larger addend: the kangaroo starts on the bigger number. Counting the starting number as the first hop lands one short.
Sidekick.game(Sidekick.play({
  title: "Kangaroo Count On",
  emoji: "🦘",
  premise: "The kangaroo starts on the bigger number and hops on. No need to start way back at zero.",
  outro: "Start with the bigger number and count on the smaller one.",
  scene: "sand",
  kind: "line",
  cast: "🌵 🪨 🌵",
  hint: "Start on the bigger number. The first hop lands on the next number.",
  tag: "counts_the_start",
  line: [0, 20, 1],
  icon: "🦘",
  rounds: [
    { say: "8 + 3. Start on 8 and hop on 3.", from: 8, ans: 11, trap: 10, why: "Do not count 8 again. The first hop lands on 9.", win: "9, 10, 11. So 8 + 3 = 11." },
    { say: "3 + 9. Start on the bigger number, 9, and hop on 3.", from: 9, ans: 12, trap: 11, why: "The first hop lands on 10. Then 11, 12.", win: "10, 11, 12. So 3 + 9 = 12." },
    { say: "Hop on by yourself.", alt: [{ say: "4 + 13. Start on 13 and hop on 4.", from: 13, ans: 17, trap: 16 }, { say: "2 + 15. Start on 15 and hop on 2.", from: 15, ans: 17, trap: 16 }, { say: "5 + 9. Start on 9 and hop on 5.", from: 9, ans: 14, trap: 13 }] },
  ],
}));
