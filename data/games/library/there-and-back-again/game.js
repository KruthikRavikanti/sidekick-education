// There and Back Again. Skill F-BF.B.4-2.
// Verifying by composition that one function is the inverse of another. Composing in one direction only, or stopping halfway, is the known slip.
Sidekick.game(Sidekick.play({
  title: "There and Back Again",
  emoji: "🔄",
  premise: "Run a number through a function and then through its inverse, and you land right where you started. In both directions.",
  outro: "f and g are inverses when f(g(x)) = x and g(f(x)) = x.",
  scene: "paper",
  kind: "type",
  icon: "🔄",
  hint: "Do the inside function first. Feed its answer into the outside one.",
  tag: "stops_halfway",
  rounds: [
    { say: "f(x) = 2x + 3 and g(x) = (x − 3) ÷ 2. Key in f(g(7)).", q: "g(7) = 2, then f(2) = ?", ans: 7, trap: 2, why: "2 is only g(7). Now put 2 into f.", win: "f(2) = 7. Back where you started." },
    { say: "Now the other direction. Key in g(f(5)).", q: "f(5) = 13, then g(13) = ?", ans: 5, trap: 13, why: "13 is only f(5). Now put 13 into g.", win: "g(13) = 5. Both directions return the input." },
    { say: "Inverses or not? Check by composing. Sort these by yourself.", kind: "sort", fs: 4.8, bins: "Inverses|Not inverses", items: ["f(x) = x + 4 and g(x) = x − 4|f(x) = 3x and g(x) = {x/3}", "f(x) = 2x and g(x) = x − 2|f(x) = x + 1 and g(x) = {1/x + 1}"], trap: ["f(x) = 2x and g(x) = x − 2", 0] },
  ],
}));
