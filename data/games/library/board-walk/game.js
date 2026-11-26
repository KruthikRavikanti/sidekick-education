// Board Walk. Skill 2.MD.B.5-2.
// Solving length problems with a number-line drawing: the first length is the start and the second is the size of the jump. Dropping the new ten on the way is the known slip.
Sidekick.game(Sidekick.play({
  title: "Board Walk",
  emoji: "🪚",
  premise: "The carpenter uses a long ruler line to add and cut boards. Start at the first length and slide to the answer.",
  outro: "A ruler line shows adding as a jump forward and cutting as a jump back.",
  scene: "forest",
  kind: "line",
  cast: "",
  line: [20, 70, 1, 10],
  icon: "🪚",
  hint: "Jump the tens first, then the ones.",
  tag: "loses_a_ten_in_the_jump",
  rounds: [
    { say: "A 26 inch board is joined to a 38 inch board. Start at 26 and jump 38.", from: 26, ans: 64, trap: 54, why: "Jump 30 to reach 56, then 8 more to reach 64.", win: "26 + 38 = 64 inches." },
    { say: "A 45 inch board has 18 inches cut off. Start at 45 and jump back 18.", from: 45, ans: 27, trap: 33, why: "Jump back 10 to 35, then back 8 more to 27.", win: "45 − 18 = 27 inches." },
    { say: "Slide to the answer by yourself.", alt: [{ say: "A 37 inch board is joined to a 25 inch board. Start at 37 and jump 25.", from: 37, ans: 62, trap: 52 }, { say: "A 60 inch board has 24 inches cut off. Start at 60 and jump back 24.", from: 60, ans: 36, trap: 44 }] },
  ],
}));
