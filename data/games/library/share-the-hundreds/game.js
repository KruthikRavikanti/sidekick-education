// Share the Hundreds. Skill 4.NBT.B.6-1.
// Dividing multi-digit numbers by one digit using place value. Leaving out a zero in the quotient (24 for 204) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Share the Hundreds",
  emoji: "🍱",
  premise: "Share out the hundreds, then the tens, then the ones. When a place has too few to share, a zero keeps its spot.",
  outro: "Divide place by place. A zero in the answer holds a place that had nothing to share.",
  scene: "kitchen",
  kind: "type",
  icon: "🍱",
  hint: "Every place of the answer needs a digit, even if it is 0.",
  tag: "drops_zero_in_quotient",
  rounds: [
    { say: "Key in the answer.", q: "84 ÷ 4", ans: 21, trap: 12, why: "8 tens shared by 4 is 2 tens. 4 ones shared by 4 is 1 one.", win: "84 ÷ 4 = 21." },
    { say: "Watch the tens place.", q: "612 ÷ 3", ans: 204, trap: 24, why: "1 ten cannot be shared by 3, so a 0 holds the tens place.", win: "612 ÷ 3 = 204." },
    { say: "Key in the answer by yourself.", alt: [{ q: "824 ÷ 4", ans: 206, trap: 26 }, { q: "5,418 ÷ 6", ans: 903, trap: 93 }] },
  ],
}));
