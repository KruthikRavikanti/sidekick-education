// One Output Each. Skill 8.F.A.1-2.
// Telling functions from non-functions in tables and graphs. Rejecting functions because outputs repeat (a horizontal line test) is the known slip.
Sidekick.game(Sidekick.play({
  title: "One Output Each",
  emoji: "🎰",
  premise: "A function gives each input exactly one output. Two inputs may share an output, but one input can never have two.",
  outro: "A function: every x has exactly one y. Repeated y-values are fine. A repeated x with different y-values is not.",
  scene: "candy",
  kind: "sort",
  fs: 5,
  hint: "Look at the inputs. Does any x show up with two different outputs?",
  tag: "horizontal_line_test",
  rounds: [
    { say: "Function or not?", bins: "Function|Not a function", items: ["x: 1, 2, 3 · y: 5, 5, 5|a horizontal line", "x: 1, 1, 2 · y: 3, 4, 5|a vertical line"], trap: ["x: 1, 2, 3 · y: 5, 5, 5", 1], why: "Each x still has just one y. Outputs are allowed to repeat.", win: "Check the inputs, not the outputs." },
    { say: "Sort these sets of points.", bins: "Function|Not a function", items: ["(1, 2), (2, 2), (3, 2)|(0, 1), (1, 3), (2, 5)", "(1, 2), (1, 5), (3, 4)|(2, 0), (2, 1), (2, 2)"], trap: ["(1, 2), (2, 2), (3, 2)", 1], why: "The x-values 1, 2 and 3 are all different. It is a function.", win: "A repeated x with new y-values breaks the rule." },
    { say: "Sort these by yourself.", bins: "Function|Not a function", items: ["x: 4, 5, 6 · y: 7, 7, 9|y = 2x + 1", "x: 4, 4, 6 · y: 7, 8, 9|a circle"], trap: ["x: 4, 5, 6 · y: 7, 7, 9", 1] },
  ],
}));
