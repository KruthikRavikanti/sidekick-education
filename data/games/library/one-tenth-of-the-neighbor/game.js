// One Tenth of the Neighbor. Skill 5.NBT.A.1-2.
// A digit in one place represents 1/10 of what it represents in the place to its left. Thinking tenths are ten times bigger than ones is the known slip.
Sidekick.game(Sidekick.play({
  title: "One Tenth of the Neighbor",
  emoji: "🏘️",
  premise: "Move one place to the right and a digit shrinks to one tenth of what it was.",
  outro: "A digit is worth one tenth as much as the same digit one place to its left.",
  scene: "city",
  kind: "fill",
  fs: 5,
  cast: "",
  hint: "Moving right makes the value smaller: one tenth each step.",
  tag: "tenths_bigger_than_ones",
  rounds: [
    { say: "Finish each comparison.", rows: [["0.3 is ___ 3", "{1/10} of"], ["30 is ___ 3", "10 times"]], extra: "{1/100} of|", trap: [0, "10 times"], why: "Tenths are smaller than ones. 0.3 is one tenth of 3.", win: "One tenth going right, ten times going left." },
    { say: "Finish these.", rows: [["0.05 is ___ 0.5", "{1/10} of"], ["0.5 is ___ 5", "{1/10} of"], ["5 is ___ 0.5", "10 times"]], extra: "100 times|", trap: [1, "10 times"], why: "0.5 is smaller than 5. It is one tenth of it.", win: "Smaller places are one tenth each step." },
    { say: "Finish these by yourself.", rows: [["0.08 is ___ 0.8", "{1/10} of"], ["8 is ___ 0.8", "10 times"], ["0.08 is ___ 8", "{1/100} of"]], extra: "100 times|", trap: [0, "10 times"] },
  ],
}));
