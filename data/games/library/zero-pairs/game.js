// Zero Pairs. Skill 7.NS.A.1-1.
// Understanding that a number and its opposite have a sum of 0. Thinking −5 + 5 = −10 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Zero Pairs",
  emoji: "🐸",
  premise: "A number and its opposite cancel out. Five steps left and five steps right bring you back to zero.",
  outro: "A number plus its opposite is 0: −5 + 5 = 0.",
  scene: "night",
  kind: "line",
  icon: "🐸",
  cast: "",
  line: [-10, 10, 1, 5],
  hint: "Adding a positive number moves right. How far?",
  tag: "opposites_double",
  rounds: [
    { say: "The frog is at −5. Add 5. Slide the frog to where it lands.", from: -5, ans: 0, trap: -10, why: "Adding 5 moves RIGHT 5 steps, back toward zero.", win: "−5 + 5 = 0." },
    { say: "The frog is at 7. Add −7. Slide the frog to where it lands.", from: 7, ans: 0, trap: 10, why: "Adding −7 moves LEFT 7 steps.", win: "7 + (−7) = 0." },
    { say: "Slide the frog by yourself.", alt: [{ say: "The frog is at 4. Add −4. Slide it to where it lands.", from: 4, ans: 0, trap: 8 }, { say: "The frog is at −3. Add 3. Slide it to where it lands.", from: -3, ans: 0, trap: -6 }, { say: "The frog is at −8. Add 8. Slide it to where it lands.", from: -8, ans: 0, trap: -10 }] },
  ],
}));
