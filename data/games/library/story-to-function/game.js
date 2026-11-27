// Story to Function. Skill 8.F.B.4-2.
// Constructing a function to model a linear relationship from a description. Swapping the slope and the intercept is the known slip.
Sidekick.game(Sidekick.play({
  title: "Story to Function",
  emoji: "🔧",
  premise: "A fee plus a rate makes a linear function. The amount per hour multiplies x. The one-time amount stands alone.",
  outro: "y = (rate)x + (starting amount).",
  scene: "city",
  kind: "fill",
  fs: 5,
  cast: "",
  hint: "Which number happens every hour? That one goes with x.",
  tag: "swaps_slope_and_intercept",
  rounds: [
    { say: "Match each story to its function.", rows: [["A plumber charges $40 to come plus $25 per hour.", "y = 25x + 40"], ["A gym charges $25 to join plus $40 per month.", "y = 40x + 25"]], extra: "y = 65x|", trap: [0, "y = 40x + 25"], why: "The plumber earns 25 every hour, so 25 goes with x.", win: "The repeating amount multiplies x." },
    { say: "Match these.", rows: [["A candle is 20 cm tall and burns 2 cm per hour.", "y = −2x + 20"], ["A pool has 20 liters and gains 2 liters per minute.", "y = 2x + 20"]], extra: "y = 20x + 2|", trap: [1, "y = 20x + 2"], why: "It starts at 20 and gains 2 each minute: 2x + 20.", win: "Burning down gives a negative rate." },
    { say: "Match these by yourself.", rows: [["A taxi charges $3 plus $2 per mile.", "y = 2x + 3"], ["A phone plan is $30 plus $5 per gigabyte.", "y = 5x + 30"]], extra: "y = 3x + 2|y = 30x + 5", trap: [0, "y = 3x + 2"] },
  ],
}));
