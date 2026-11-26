// Find the Spot. Skill 2.MD.B.6-1.
// Placing whole numbers on a number line with equal spacing: only the ends are labelled, so the child counts spaces. Counting the tick at zero as one lands a space short.
Sidekick.game(Sidekick.play({
  title: "Find the Spot",
  emoji: "📍",
  premise: "This number line only has names on its two ends. Count the equal spaces to find where each number lives.",
  outro: "On a number line, every space is the same size, so each number has one exact spot.",
  scene: "sky",
  kind: "line",
  cast: "",
  line: [0, 20, 1],
  labels: "ends",
  hint: "Zero is the start. The first space takes you to 1.",
  tag: "counts_the_first_tick",
  rounds: [
    { say: "Slide the pin to where 13 belongs.", ans: 13, trap: 12, why: "The tick at the start is 0, not 1. Count the spaces.", win: "13 spaces from zero." },
    { say: "Slide the pin to where 7 belongs.", ans: 7, trap: 6, why: "The tick at the start is 0. Count 7 spaces.", win: "7 spaces from zero." },
    { say: "Place the pin by yourself.", alt: [{ say: "Slide the pin to where 16 belongs.", ans: 16, trap: 15 }, { say: "Slide the pin to where 9 belongs.", ans: 9, trap: 8 }] },
  ],
}));
