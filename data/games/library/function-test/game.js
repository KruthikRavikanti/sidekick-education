// Function Test. Skill F-IF.A.1-1.
// Understanding that a function assigns to each element of the domain exactly one element of the range. Thinking repeated outputs are not allowed is the known slip.
Sidekick.game(Sidekick.play({
  title: "Function Test",
  emoji: "🎛️",
  premise: "A function assigns each input exactly one output. Two inputs can share an output. One input cannot have two.",
  outro: "Check the inputs: if any input appears with two different outputs, it is not a function.",
  scene: "candy",
  kind: "sort",
  fs: 5,
  hint: "Look only at the first numbers. Does any repeat with a different partner?",
  tag: "repeated_outputs_forbidden",
  rounds: [
    { say: "Function or not?", bins: "Function|Not a function", items: ["(1, 2), (2, 2), (3, 5)|(0, 0), (1, 1), (2, 4)", "(1, 2), (1, 3)|(4, 0), (4, 1), (5, 2)"], trap: ["(1, 2), (2, 2), (3, 5)", 1], why: "The output 2 repeats, which is fine. Each input still has one output.", win: "Repeated inputs are the problem, not repeated outputs." },
    { say: "Does each rule give exactly one output for each input?", bins: "Function|Not a function", items: ["a student → their birthday|a number → its square", "a birthday → a student born then|a number → a number that squares to it"], trap: ["a birthday → a student born then", 0], why: "Many students can share one birthday. One input, many outputs.", win: "One input, one output." },
    { say: "Sort these by yourself.", bins: "Function|Not a function", items: ["(2, 7), (3, 7), (4, 7)|(−1, 1), (0, 0), (1, 1)", "(2, 7), (2, 8)|(0, 1), (0, −1), (1, 0)"], trap: ["(2, 7), (3, 7), (4, 7)", 1] },
  ],
}));
