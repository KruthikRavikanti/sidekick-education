// Stretch and Squeeze. Skill F-BF.B.3-2.
// Identifying the effect on the graph of replacing f(x) by k f(x) and f(kx). Confusing vertical and horizontal stretch is the known slip.
Sidekick.game(Sidekick.play({
  title: "Stretch and Squeeze",
  emoji: "🪗",
  premise: "Multiplying outside the function stretches the graph up and down. Multiplying inside, next to x, squeezes it sideways.",
  outro: "k·f(x) is a vertical stretch. f(kx) is a horizontal squeeze. −f(x) flips over the x-axis.",
  scene: "paper",
  kind: "fill",
  fs: 5.6,
  figW: 17,
  cast: "",
  hint: "Outside the function changes heights. Inside changes how fast you move along x.",
  tag: "confuses_stretch_direction",
  rounds: [
    { say: "One tile is the original wave f(x). Match each change to its graph.", rows: [["2 f(x)", "~plot:sin:4:1"], ["f(2x)", "~plot:sin:2:2"]], extra: "~plot:sin:2:1", trap: [0, "~plot:sin:2:2"], why: "2 f(x) doubles every height. The wave gets taller, not narrower.", win: "Outside: taller. Inside: squeezed." },
    { say: "Does each change act up and down, or sideways?", kind: "sort", fs: 6, bins: "Up and down|Sideways", items: ["2 f(x)|{1/2} f(x)|−f(x)", "f(2x)|f({1/2}x)"], trap: ["f(2x)", 0], why: "The 2 is inside with x. It changes the horizontal direction.", win: "Outside is vertical. Inside is horizontal." },
    { say: "Describe each change by yourself.", rows: [["3 f(x)", "stretched taller"], ["f(3x)", "squeezed narrower"], ["−f(x)", "flipped over the x-axis"]], extra: "moved 3 to the right|", trap: [1, "stretched taller"] },
  ],
}));
