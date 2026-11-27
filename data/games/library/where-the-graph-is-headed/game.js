// Where the Graph Is Headed. Skill F-IF.B.4-2.
// Describing end behavior and symmetry of graphs. Describing only the visible window is the known slip.
Sidekick.game(Sidekick.play({
  title: "Where the Graph Is Headed",
  emoji: "🧭",
  premise: "End behavior describes what a graph does far to the left and far to the right, beyond the part you can see.",
  outro: "Describe end behavior by what y does as x gets very large and very negative.",
  scene: "paper",
  kind: "fill",
  fs: 5,
  figW: 17,
  cast: "",
  hint: "Follow the curve off both edges. Does each end go up or down?",
  tag: "visible_window_only",
  rounds: [
    { say: "Match each end behavior to a graph.", rows: [["rises on both ends", "~plot:quad:0.4:0:-3"], ["falls on both ends", "~plot:quad:-0.4:0:3"], ["falls left, rises right", "~plot:cubic:0.12"]], trap: [1, "~plot:quad:0.4:0:-3"], why: "That one opens upward. Both of its ends rise.", win: "Three different end behaviors." },
    { say: "Is each graph symmetric about the y-axis?", kind: "sort", fs: 6, bins: "Symmetric|Not symmetric", items: ["y = x^2|y = x^4 + 1|y = −x^2", "y = x^3|y = 2x + 1"], trap: ["y = x^3", 0], why: "For x^3, the left side goes down while the right goes up. No mirror match.", win: "Even powers mirror across the y-axis." },
    { say: "Match these by yourself.", rows: [["rises left, falls right", "~plot:cubic:-0.12"], ["rises on both ends", "~plot:quad:0.4:0:-3"], ["flattens on the left, rises on the right", "~plot:exp:1:2:-3"]], extra: "~plot:quad:-0.4:0:3", trap: [0, "~plot:quad:-0.4:0:3"] },
  ],
}));
