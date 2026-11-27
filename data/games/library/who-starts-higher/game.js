// Who Starts Higher?. Skill 8.F.A.2-2.
// Comparing the initial values of two functions in different representations. Confusing the initial value with the rate is the known slip.
Sidekick.game(Sidekick.play({
  title: "Who Starts Higher?",
  emoji: "🚦",
  premise: "The initial value is where a function starts: its output when x is 0. Do not mix it up with the rate.",
  outro: "Initial value is y when x = 0: the number alone in y = mx + b, or the x = 0 row of a table.",
  scene: "field",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "What is y when x is 0?",
  tag: "initial_value_as_rate",
  rounds: [
    { say: "A is y = 3x + 1. B is the table. Find each start value.", fig: { type: "table", rows: [["x", 0, 1, 2], ["y", 2, 6, 10]] }, rows: [["start of A", "1"], ["start of B", "2"], ["starts higher", "B"]], extra: "A|3", trap: [0, "3"], why: "3 is the rate of A. When x is 0, y is 1.", win: "B starts at 2. A starts at 1." },
    { say: "A starts with $50 and adds $10 a week. B is y = 25x + 30.", rows: [["start of A", "50"], ["start of B", "30"], ["starts higher", "A"]], extra: "B|25", trap: [1, "25"], why: "25 is the rate of B. Its start is the number alone: 30.", win: "A starts higher." },
    { say: "A is y = 6x + 4. B is the table. Compare by yourself.", fig: { type: "table", rows: [["x", 0, 1, 2], ["y", 7, 9, 11]] }, rows: [["start of A", "4"], ["start of B", "7"], ["starts higher", "B"]], extra: "A|6", trap: [0, "6"] },
  ],
}));
