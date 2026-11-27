// Explicit or Recursive Rule. Skill F-BF.A.1-1.
// Determining an explicit expression or a recursive process from a context. Mixing up the starting value and the change is the known slip.
Sidekick.game(Sidekick.play({
  title: "Explicit or Recursive Rule",
  emoji: "🏦",
  premise: "A pattern can be described two ways. An explicit rule jumps straight to any step. A recursive rule builds each step from the one before.",
  outro: "Explicit: f(n) = start + change × n. Recursive: f(n) = f(n − 1) + change.",
  scene: "city",
  kind: "fill",
  fs: 5,
  cast: "",
  hint: "Which number is there at the start? Which number is added each step?",
  tag: "mixes_up_start_value",
  rounds: [
    { say: "Savings start at $100 and grow by $25 each week. Match each rule.", rows: [["explicit rule", "f(n) = 100 + 25n"], ["recursive rule", "f(n) = f(n − 1) + 25"]], extra: "f(n) = 25 + 100n|", trap: [0, "f(n) = 25 + 100n"], why: "100 is the start. 25 is what repeats, so 25 multiplies n.", win: "Start plus change times n." },
    { say: "A bounce starts at 80 cm and halves each time. Match each rule.", rows: [["explicit rule", "h(n) = 80(0.5)^n"], ["recursive rule", "h(n) = 0.5 × h(n − 1)"]], extra: "h(n) = 80 − 0.5n|", trap: [0, "h(n) = 80 − 0.5n"], why: "Halving multiplies by 0.5 each time. It does not subtract 0.5.", win: "Repeated multiplying needs an exponent." },
    { say: "A tank holds 500 liters and drains 20 liters each minute. Match by yourself.", rows: [["explicit rule", "v(t) = 500 − 20t"], ["recursive rule", "v(t) = v(t − 1) − 20"]], extra: "v(t) = 20 − 500t|v(t) = v(t − 1) + 20", trap: [0, "v(t) = 20 − 500t"] },
  ],
}));
