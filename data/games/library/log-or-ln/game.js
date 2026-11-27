// Log or ln?. Skill F-LE.A.4-2.
// Evaluating logarithms with base 2, 10 or e using technology. Mixing up the bases is the known slip.
Sidekick.game(Sidekick.play({
  title: "Log or ln?",
  emoji: "🧮",
  premise: "The log key uses base 10. The ln key uses base e, about 2.718. Same idea, different base.",
  outro: "log means base 10 and ln means base e. log 1000 = 3 and ln e^2 = 2.",
  scene: "desk",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "log: 10 to what power? ln: e to what power?",
  tag: "mixes_log_bases",
  rounds: [
    { say: "Match each key press to its value.", rows: [["log 1000", "3"], ["ln e^2", "2"]], extra: "1000 6.9", trap: [1, "6.9"], why: "ln undoes powers of e. e to the power 2 gives back 2.", win: "10^3 = 1000 and e^2 = e^2." },
    { say: "Which base does each one use?", kind: "sort", fs: 5.4, bins: "Base 10|Base e", items: ["log 100 = 2|the log key|log 0.1 = −1", "ln e = 1|the ln key|ln 1 = 0"], trap: ["ln e = 1", 0], why: "ln is the natural log. Its base is e.", win: "log is base 10. ln is base e." },
    { say: "Match each one to its value by yourself.", rows: [["log 10,000", "4"], ["ln e^5", "5"], ["log 0.1", "−1"], ["ln 1", "0"]], extra: "10 e", trap: [1, "e"] },
  ],
}));
