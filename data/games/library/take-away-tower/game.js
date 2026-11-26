// Take-Away Tower. Skill 2.OA.B.2-2.
// Mental strategies for subtracting within 20: facts are sorted by their answers, which rewards strategies such as going through ten.
Sidekick.game(Sidekick.play({
  title: "Take-Away Tower",
  emoji: "🏰",
  premise: "Each brick has a take-away fact. Stack every brick on the tower floor that shows its answer.",
  outro: "Use tens and facts you know to take away quickly.",
  scene: "sky",
  kind: "sort",
  cast: "🏰 ☁️ 🚩 ☁️",
  hint: "Go back to 10 first, then take away the rest.",
  tag: "fact_slip",
  rounds: [
    { say: "Stack each fact on its answer.", bins: "6|7|8", items: ["13 − 7|15 − 9", "16 − 9|12 − 5|14 − 7", "17 − 9|15 − 7"], trap: ["16 − 9", 2], why: "16 − 6 is 10, and 3 more back is 7.", win: "Every brick is in place." },
    { say: "New answers. Where does each brick go?", bins: "5|8|9", items: ["14 − 9|11 − 6", "13 − 5|16 − 8", "18 − 9|17 − 8"], trap: ["17 − 8", 1], why: "17 − 7 is 10, and 1 more back is 9.", win: "All stacked." },
    { say: "Stack these by yourself.", bins: "4|7|9", items: ["12 − 8|13 − 9", "15 − 8|14 − 7", "16 − 7|15 − 6"], trap: ["15 − 8", 0] },
  ],
}));
