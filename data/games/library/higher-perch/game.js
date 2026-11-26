// Higher Perch. Skill K.CC.C.7-1.
// Comparing numerals by counting order: both numbers are marked on a number line, and the one that comes later in the count is greater.
Sidekick.game(Sidekick.play({
  title: "Higher Perch",
  emoji: "🐦",
  premise: "Two perches have numbers on them. Fly the bird to the perch with the greater number.",
  outro: "When you count, the number that comes later is the greater one.",
  scene: "sky",
  kind: "line",
  cast: "☁️ 🌤️ ☁️",
  hint: "Count up from 0. The number you reach later is greater.",
  tag: "picks_the_smaller_number",
  line: [0, 10, 1],
  icon: "🐦",
  rounds: [
    { say: "Which is greater, 4 or 7? Fly the bird there.", marks: [[4, "🪵"], [7, "🪵"]], ans: 7, trap: 4, why: "Count up: you pass 4 before you reach 7. The later number is greater.", win: "7 comes after 4, so 7 is greater." },
    { say: "Which is greater, 9 or 6? Fly the bird there.", marks: [[6, "🪵"], [9, "🪵"]], ans: 9, trap: 6, why: "You pass 6 before you reach 9. 9 is greater.", win: "9 comes after 6, so 9 is greater." },
    { say: "Fly to the greater number by yourself.", alt: [{ say: "Which is greater, 8 or 5? Fly the bird there.", marks: [[5, "🪵"], [8, "🪵"]], ans: 8, trap: 5 }, { say: "Which is greater, 3 or 6? Fly the bird there.", marks: [[3, "🪵"], [6, "🪵"]], ans: 6, trap: 3 }, { say: "Which is greater, 10 or 7? Fly the bird there.", marks: [[7, "🪵"], [10, "🪵"]], ans: 10, trap: 7 }] },
  ],
}));
