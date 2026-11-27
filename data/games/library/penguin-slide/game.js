// Penguin Slide. Skill K.OA.A.5-2.
// Subtraction facts within 5 on a number line: the penguin slides back one for each taken away. Counting the starting number as a slide ends one too high.
Sidekick.game(Sidekick.play({
  title: "Penguin Slide",
  emoji: "🐧",
  premise: "The penguin slides back down the ice hill to take away. Each slide back is one less.",
  outro: "Taking away means sliding back. The starting number is not one of the slides.",
  scene: "snow",
  kind: "line",
  cast: "🧊 ❄️ 🧊",
  hint: "The first slide back lands on the number before.",
  tag: "counts_the_start",
  line: [0, 5, 1],
  icon: "🐧",
  rounds: [
    { say: "Start at 5. Slide back 2 to find 5 take away 2.", from: 5, ans: 3, trap: 4, why: "The first slide lands on 4. The second lands on 3.", win: "5 take away 2 is 3." },
    { say: "Start at 4. Slide back 3 to find 4 take away 3.", from: 4, ans: 1, trap: 2, why: "Three slides: 3, 2, 1.", win: "4 take away 3 is 1." },
    { say: "Slide the penguin by yourself.", alt: [{ say: "Start at 5. Slide back 3 to find 5 take away 3.", from: 5, ans: 2, trap: 3 }, { say: "Start at 5. Slide back 4 to find 5 take away 4.", from: 5, ans: 1, trap: 2 }, { say: "Start at 4. Slide back 2 to find 4 take away 2.", from: 4, ans: 2, trap: 3 }] },
  ],
}));
