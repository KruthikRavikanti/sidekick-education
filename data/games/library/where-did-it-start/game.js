// Where Did It Start?. Skill 1.OA.D.8-2.
// Finding the unknown start in ? − b = c: the flag marks where the fox ended. The start is b steps further on. Subtracting the two numbers is the known slip.
Sidekick.game(Sidekick.play({
  title: "Where Did It Start?",
  emoji: "🐾",
  premise: "The fox walked back some steps and stopped at the flag. Follow its tracks to find where it started.",
  outro: "To find the start, put back what was taken away.",
  scene: "snow",
  kind: "line",
  cast: "🐾 ❄️ 🌲 ❄️",
  hint: "The fox walked back. So the start is ahead of the flag.",
  tag: "subtracts_the_two_numbers",
  line: [0, 20, 1],
  icon: "🦊",
  rounds: [
    { say: "▢ − 3 = 5. The fox walked back 3 and stopped at 5. Slide the fox to where it started.", marks: [[5, "🚩"]], ans: 8, trap: 2, why: "The fox walked BACK to 5. So it started further on, at 5 and 3 more.", win: "8 − 3 = 5." },
    { say: "▢ − 4 = 9. The fox walked back 4 and stopped at 9. Where did it start?", marks: [[9, "🚩"]], ans: 13, trap: 5, why: "Put the 4 steps back: 9 and 4 more.", win: "13 − 4 = 9." },
    { say: "Find the start by yourself.", alt: [{ say: "▢ − 6 = 7. The fox walked back 6 and stopped at 7. Where did it start?", marks: [[7, "🚩"]], ans: 13, trap: 1 }, { say: "▢ − 5 = 8. The fox walked back 5 and stopped at 8. Where did it start?", marks: [[8, "🚩"]], ans: 13, trap: 3 }, { say: "▢ − 2 = 9. The fox walked back 2 and stopped at 9. Where did it start?", marks: [[9, "🚩"]], ans: 11, trap: 7 }] },
  ],
}));
