// Mirror Across Zero. Skill 6.NS.C.6-1.
// Recognizing opposite signs as locations on opposite sides of 0, and that the opposite of the opposite is the number itself. Thinking −(−3) = −3 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Mirror Across Zero",
  emoji: "🪞",
  premise: "Every number has an opposite the same distance from zero on the other side. The opposite of an opposite brings you back.",
  outro: "Opposites are equally far from 0 on opposite sides, so −(−3) = 3.",
  scene: "night",
  kind: "line",
  icon: "🐸",
  cast: "",
  line: [-6, 6, 1],
  hint: "Count how far it is from 0. Go that far on the other side.",
  tag: "opposite_of_opposite",
  rounds: [
    { say: "The frog sits at 0. Slide it to the opposite of −3.", from: 0, ans: 3, trap: -3, why: "That is −3 itself. Its opposite is on the other side of 0.", win: "The opposite of −3 is 3." },
    { say: "Key in the value of −(−5). Use the ± key if you need it.", kind: "type", icon: "🪞", q: "−(−5)", ans: 5, trap: -5, why: "The opposite of −5 is back on the positive side.", win: "−(−5) = 5." },
    { say: "Slide the frog by yourself.", alt: [{ say: "The frog sits at 0. Slide it to the opposite of 4.", from: 0, ans: -4, trap: 4 }, { say: "The frog sits at 0. Slide it to −(−2).", from: 0, ans: 2, trap: -2 }] },
  ],
}));
