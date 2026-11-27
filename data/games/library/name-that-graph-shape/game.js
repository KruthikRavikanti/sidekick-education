// Name That Graph Shape. Skill F-IF.C.7-2.
// Graphing square root, cube root, piecewise, step and absolute value functions. Connecting pieces that should not connect is the known slip.
Sidekick.game(Sidekick.play({
  title: "Name That Graph Shape",
  emoji: "🖼️",
  premise: "Each family of functions has a signature shape: the V of absolute value, the half-arch of a square root, the stairs of a step function.",
  outro: "Recognize the graphs of square root, cube root, absolute value, step and piecewise functions.",
  scene: "paper",
  kind: "fill",
  fs: 5.4,
  figW: 17,
  cast: "",
  hint: "Sharp corner? Starts at a point? Flat stairs?",
  tag: "connects_pieces",
  rounds: [
    { say: "Match each function family to its graph.", rows: [["square root", "~plot:sqrt:2:-4:-3"], ["absolute value", "~plot:abs:1:0:-3"], ["step function", "~plot:step"]], extra: "~plot:quad:0.4:0:-3", trap: [1, "~plot:quad:0.4:0:-3"], why: "That is a smooth U. Absolute value makes a sharp V.", win: "Arch, V and stairs." },
    { say: "f(x) = x when x < 0, and f(x) = 2 when x ≥ 0. True or not true?", kind: "sort", fs: 5.4, bins: "True|Not true", items: ["f(−3) = −3|f(0) = 2|f(5) = 2", "f(0) = 0|the two pieces must join up"], trap: ["the two pieces must join up", 0], why: "Pieces are allowed to jump. At x = 0 this graph leaps from 0 up to 2.", win: "Use the rule for the piece x falls in." },
    { say: "Match these by yourself.", rows: [["cube root", "~plot:cbrt:2"], ["square root", "~plot:sqrt:2:-4:-3"], ["absolute value", "~plot:abs:1:0:-3"]], extra: "~plot:cubic:0.12 ~plot:quad:0.4:0:-3", trap: [0, "~plot:cubic:0.12"] },
  ],
}));
