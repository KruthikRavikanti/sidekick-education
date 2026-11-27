// Two Quantities, One Equation. Skill A-CED.A.2-1.
// Creating equations in two variables to represent relationships between quantities. Mixing up which variable depends on which is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Quantities, One Equation",
  emoji: "🚕",
  premise: "An equation in two variables ties two quantities together. Decide which one depends on the other before you write it.",
  outro: "Write the dependent quantity in terms of the independent one: C = 2m + 3.",
  scene: "city",
  kind: "fill",
  fs: 5,
  cast: "",
  hint: "Which quantity is the result? Put that one alone on the left.",
  tag: "mixes_up_dependence",
  rounds: [
    { say: "A taxi charges $3 plus $2 per mile. Match each equation.", rows: [["cost C from miles m", "C = 2m + 3"], ["miles m from cost C", "m = {C − 3/2}"]], extra: "m = 2C + 3|", trap: [1, "m = 2C + 3"], why: "To get miles from cost, undo the steps: subtract 3, then divide by 2.", win: "One relationship, two directions." },
    { say: "Match each equation.", rows: [["perimeter P of a square with side s", "P = 4s"], ["side s from the perimeter P", "s = {P/4}"]], extra: "s = 4P|", trap: [1, "s = 4P"], why: "The side is a quarter of the perimeter.", win: "Multiply one way, divide the other." },
    { say: "You earn $12 an hour. Match these by yourself.", rows: [["pay P from hours h", "P = 12h"], ["hours h from pay P", "h = {P/12}"]], extra: "h = 12P|P = h + 12", trap: [1, "h = 12P"] },
  ],
}));
