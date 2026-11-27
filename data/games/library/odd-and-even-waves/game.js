// Odd and Even Waves. Skill F-TF.A.4-1.
// Using the unit circle to explain the symmetry (odd and even) of trigonometric functions. Thinking sin(−x) = sin(x) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Odd and Even Waves",
  emoji: "🌊",
  premise: "Flip an angle to its negative and the point reflects across the x-axis. Its height changes sign. Its across distance does not.",
  outro: "Sine and tangent are odd: sin(−x) = −sin x. Cosine is even: cos(−x) = cos x.",
  scene: "ocean",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "A negative angle goes below the x-axis. What happens to the height? To the across distance?",
  tag: "sine_treated_as_even",
  rounds: [
    { say: "What does each one equal?", rows: [["sin(−x)", "−sin x"], ["cos(−x)", "cos x"], ["tan(−x)", "−tan x"]], extra: "sin x|", trap: [0, "sin x"], why: "Going clockwise puts the point below the axis. Its height flips sign.", win: "Height flips. Across stays." },
    { say: "Even graphs mirror in the y-axis. Odd graphs look the same after a half turn about 0.", kind: "sort", figW: 14, bins: "Even: mirror image|Odd: half turn", items: ["~plot:cos:2:1 ~plot:quad:0.4:0:-2", "~plot:sin:2:1 ~plot:cubic:0.3:0:0"], trap: ["~plot:sin:2:1", 0], why: "The sine wave goes up on the right and down on the left. That is a half turn, not a mirror.", win: "Cosine mirrors. Sine turns." },
    { say: "Find each value by yourself.", rows: [["sin(−30°)", "−{1/2}"], ["cos(−60°)", "{1/2}"], ["tan(−45°)", "−1"]], extra: "1", trap: [1, "−{1/2}"] },
  ],
}));
