// Zero the Hero. Skill 3.OA.C.7-1.
// Multiplication facts for 0, 1, 2, 5 and 10: the zero and one facts sit side by side, so treating n × 0 as n is caught.
Sidekick.game(Sidekick.play({
  title: "Zero the Hero",
  emoji: "🦸",
  premise: "Times zero wipes everything out, and times one changes nothing. Send each fact to its product.",
  outro: "Any number times 0 is 0. Any number times 1 is itself.",
  scene: "city",
  kind: "sort",
  cast: "",
  hint: "Zero groups of something is nothing at all.",
  tag: "times_zero_is_the_number",
  rounds: [
    { say: "Send each fact to its product.", bins: "0|7|14", items: ["7 × 0|0 × 7", "7 × 1|1 × 7", "7 × 2|2 × 7"], trap: ["7 × 0", 1], why: "7 groups of nothing is nothing. 7 × 0 = 0.", win: "Zero, the number itself, and its double." },
    { say: "New facts. Where does each one go?", bins: "0|9|45", items: ["9 × 0|0 × 9", "9 × 1|1 × 9", "9 × 5|5 × 9"], trap: ["9 × 0", 1], why: "9 groups of nothing is nothing. 9 × 0 = 0.", win: "All sorted." },
    { say: "Sort these by yourself.", bins: "0|6|60", items: ["6 × 0|0 × 6", "1 × 6|6 × 1", "6 × 10|10 × 6"], trap: ["0 × 6", 1] },
  ],
}));
