// Deer Leaps. Skill 2.MD.B.6-2.
// Showing sums and differences as jumps on a number line. Counting the starting tick as the first jump lands one short.
Sidekick.game(Sidekick.play({
  title: "Deer Leaps",
  emoji: "🦌",
  premise: "The deer leaps forward to add and back to take away. Each leap moves it one whole space.",
  outro: "A sum is a jump forward on the number line. A difference is a jump back.",
  scene: "forest",
  kind: "line",
  cast: "🌲 🍄 🌲",
  line: [0, 30, 1, 5],
  icon: "🦌",
  hint: "The first leap lands on the next number, not on the start.",
  tag: "counts_the_start",
  rounds: [
    { say: "Start at 8. Leap forward 5.", from: 8, ans: 13, trap: 12, why: "The first leap lands on 9. Count 5 leaps.", win: "8 + 5 = 13." },
    { say: "Start at 21. Leap back 6.", from: 21, ans: 15, trap: 16, why: "The first leap back lands on 20. Count 6 leaps.", win: "21 − 6 = 15." },
    { say: "Leap by yourself.", alt: [{ say: "Start at 14. Leap forward 9.", from: 14, ans: 23, trap: 22 }, { say: "Start at 27. Leap back 8.", from: 27, ans: 19, trap: 20 }] },
  ],
}));
