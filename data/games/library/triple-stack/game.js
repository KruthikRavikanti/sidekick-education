// Triple Stack. Skill 2.NBT.B.6-1.
// Adding three or four two-digit numbers: the ones are added first and any new tens are carried. Losing a regrouped ten is the known slip.
Sidekick.game(Sidekick.play({
  title: "Triple Stack",
  emoji: "🥞",
  premise: "Three or four numbers are stacked up to add. Keep track of every new ten as you go.",
  outro: "Add all the ones, then all the tens, and remember every new ten.",
  scene: "kitchen",
  kind: "type",
  icon: "🥞",
  hint: "Add all the ones first. How many new tens did they make?",
  tag: "loses_a_new_ten",
  rounds: [
    { say: "Add all three numbers.", q: "23 + 14 + 32", ans: 69, trap: 37, why: "That is only two of them. Add the third number too.", win: "23 + 14 + 32 = 69." },
    { say: "The ones make a new ten this time.", q: "26 + 17 + 35", ans: 78, trap: 68, why: "6 + 7 + 5 is 18 ones. That is a new ten to add.", win: "26 + 17 + 35 = 78." },
    { say: "Add these by yourself.", alt: [{ q: "18 + 24 + 37", ans: 79, trap: 69 }, { q: "15 + 25 + 36 + 12", ans: 88, trap: 78 }] },
  ],
}));
