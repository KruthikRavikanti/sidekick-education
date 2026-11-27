// Even, Odd or Neither. Skill F-BF.B.3-3.
// Recognizing even and odd functions from graphs and expressions. Calling every symmetric-looking graph even is the known slip.
Sidekick.game(Sidekick.play({
  title: "Even, Odd or Neither",
  emoji: "🪞",
  premise: "An even function mirrors across the y-axis. An odd function looks the same after a half turn about the origin. Most are neither.",
  outro: "Even: f(−x) = f(x). Odd: f(−x) = −f(x).",
  scene: "paper",
  kind: "sort",
  fs: 5.6,
  figW: 15,
  hint: "Replace x with −x. Do you get the same thing, the opposite, or neither?",
  tag: "every_symmetry_is_even",
  rounds: [
    { say: "Even, odd or neither?", bins: "Even|Odd|Neither", items: ["f(x) = x^2|f(x) = x^4 + 1", "f(x) = x^3|f(x) = x", "f(x) = x^2 + x|f(x) = 2^x"], trap: ["f(x) = x^3", 0], why: "(−x)^3 is −x^3, the opposite. That makes it odd.", win: "Even powers are even. Odd powers are odd. Mixed is neither." },
    { say: "Sort the graphs.", bins: "Even|Odd", items: ["~plot:quad:0.4:0:-3 ~plot:abs:1:0:-3", "~plot:cubic:0.12 ~plot:line:1:0"], trap: ["~plot:cubic:0.12", 0], why: "Its two halves point opposite ways. It has half-turn symmetry, not mirror symmetry.", win: "Mirror: even. Half turn: odd." },
    { say: "Sort these by yourself.", bins: "Even|Odd|Neither", items: ["f(x) = 3x^2|f(x) = x^6", "f(x) = x^5|f(x) = −2x", "f(x) = x + 1|f(x) = x^2 − x"], trap: ["f(x) = x + 1", 1] },
  ],
}));
