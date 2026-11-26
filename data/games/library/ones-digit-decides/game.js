// Ones Digit Decides. Skill 2.OA.C.3-3.
// Using the ones digit to tell odd from even: numbers whose tens digit is odd but ones digit is even (like 16) catch a child who looks at the tens digit.
Sidekick.game(Sidekick.play({
  title: "Ones Digit Decides",
  emoji: "🎲",
  premise: "Odd or even? Only one digit gets to decide, and it is not the first one.",
  outro: "Look at the ones digit: 0, 2, 4, 6 or 8 means even.",
  scene: "candy",
  kind: "sort",
  cast: "",
  hint: "Look only at the last digit.",
  tag: "looks_at_tens_digit",
  rounds: [
    { say: "Sort each number: even or odd?", bins: "Even|Odd", items: ["16 30 52", "21 47"], trap: ["16", 1], why: "Look at the ones digit of 16. It is 6, so 16 is even.", win: "The ones digit decides." },
    { say: "More numbers. Check the ones digit.", bins: "Even|Odd", items: ["34 58 70 92", "45 63 81"], trap: ["34", 1], why: "The ones digit of 34 is 4, so 34 is even.", win: "Evens end in 0, 2, 4, 6 or 8." },
    { say: "Sort these by yourself.", bins: "Even|Odd", items: ["74 90 38", "27 49 65 83"], trap: ["27", 0] },
  ],
}));
