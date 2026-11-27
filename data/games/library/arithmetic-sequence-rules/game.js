// Arithmetic Sequence Rules. Skill F-BF.A.2-1.
// Writing arithmetic sequences recursively and with an explicit formula. Using n where n − 1 is needed is the known slip.
Sidekick.game(Sidekick.play({
  title: "Arithmetic Sequence Rules",
  emoji: "➕",
  premise: "An arithmetic sequence adds the same amount each step. To reach term n from term 1 you add that amount n − 1 times.",
  outro: "a(n) = a(1) + d(n − 1). The first term needs zero steps.",
  scene: "desk",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "How many jumps from the 1st term to the nth? One fewer than n.",
  tag: "n_instead_of_n_minus_1",
  rounds: [
    { say: "The sequence is 5, 8, 11, ... Match each part.", rows: [["explicit rule", "a(n) = 5 + 3(n − 1)"], ["recursive rule", "a(n) = a(n − 1) + 3"], ["20th term", "62"]], extra: "a(n) = 5 + 3n|65", trap: [0, "a(n) = 5 + 3n"], why: "Test n = 1: 5 + 3 gives 8, but the first term is 5.", win: "5 + 3 × 19 = 62." },
    { say: "The sequence is 10, 7, 4, ... Match each part.", rows: [["explicit rule", "a(n) = 10 − 3(n − 1)"], ["10th term", "−17"]], extra: "a(n) = 10 − 3n|−20", trap: [0, "a(n) = 10 − 3n"], why: "Test n = 1: 10 − 3 gives 7, which is the second term.", win: "10 − 3 × 9 = −17." },
    { say: "The sequence is 2, 6, 10, ... Match by yourself.", rows: [["explicit rule", "a(n) = 2 + 4(n − 1)"], ["recursive rule", "a(n) = a(n − 1) + 4"], ["11th term", "42"]], extra: "a(n) = 2 + 4n|46", trap: [0, "a(n) = 2 + 4n"] },
  ],
}));
