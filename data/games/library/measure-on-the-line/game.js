// Measure on the Line. Skill 4.MD.A.2-3.
// Representing measurement quantities on a number line with a scale: elapsed time, volume and length are shown as jumps on evenly spaced lines.
Sidekick.game(Sidekick.play({
  title: "Measure on the Line",
  emoji: "🧭",
  premise: "A number line can show time, liquid or length. Each small step is the same size, so count the steps with care.",
  outro: "A number line with equal steps can show any measurement problem.",
  scene: "paper",
  kind: "line",
  cast: "",
  hint: "Find out what one small step is worth before you move.",
  tag: "misreads_the_scale",
  rounds: [
    { say: "A show starts at 2:30 and lasts 1 hour 45 minutes. Slide to the time it ends.", line: [0, 180, 15, 2], fmt: "clock:2", from: 30, ans: 135, trap: 75, why: "That hop was only 45 minutes. Hop one more hour.", win: "It ends at 4:15." },
    { say: "A jug has 250 milliliters. You pour in 500 more. Slide to the new amount.", line: [0, 1000, 50, 4], from: 250, ans: 750, trap: 500, why: "That is where 500 is. You are adding 500 more to the 250.", win: "250 + 500 = 750 milliliters." },
    { say: "Slide to the answer by yourself.", alt: [{ say: "Practice starts at 3:45 and lasts 1 hour 30 minutes. Slide to the time it ends.", line: [0, 180, 15, 2], fmt: "clock:3", from: 45, ans: 135, trap: 105 }, { say: "A plant is 40 centimeters tall. It grows 25 more. Slide to its new height.", line: [0, 100, 5, 4], from: 40, ans: 65, trap: 25 }] },
  ],
}));
