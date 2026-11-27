// What h(2) = 48 Means. Skill F-IF.A.2-2.
// Interpreting statements that use function notation in terms of a context. Not being able to say what f(3) = 10 means is the known slip.
Sidekick.game(Sidekick.play({
  title: "What h(2) = 48 Means",
  emoji: "🏀",
  premise: "A statement in function notation is a sentence. The number inside the brackets is the input. The other side is the output.",
  outro: "f(a) = b means: when the input is a, the output is b.",
  scene: "field",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "The number in the brackets is the input. What quantity is that?",
  tag: "cannot_interpret_notation",
  rounds: [
    { say: "h(t) is a ball’s height in feet after t seconds. What does each statement mean?", rows: [["h(2) = 48", "after 2 seconds it is 48 feet high"], ["h(0) = 5", "it starts 5 feet up"]], extra: "after 48 seconds it is 2 feet high|", trap: [0, "after 48 seconds it is 2 feet high"], why: "The 2 is inside the brackets, so 2 is the time.", win: "Input is time. Output is height." },
    { say: "C(n) is the cost in dollars of n tickets. What does each mean?", rows: [["C(3) = 24", "3 tickets cost $24"], ["C(n) = 80", "the number of tickets that cost $80"]], extra: "24 tickets cost $3|", trap: [0, "24 tickets cost $3"], why: "n is in the brackets. 3 is the number of tickets.", win: "One gives an output. One asks for an input." },
    { say: "P(d) is a plant’s height in cm on day d. Match by yourself.", rows: [["P(10) = 6", "on day 10 it is 6 cm tall"], ["P(d) = 12", "the day it reaches 12 cm"]], extra: "on day 6 it is 10 cm tall|it grows 12 cm a day", trap: [0, "on day 6 it is 10 cm tall"] },
  ],
}));
