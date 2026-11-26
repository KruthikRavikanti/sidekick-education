// Star Rows. Skill K.CC.B.5-1.
// Counting up to 20 objects arranged in rows: the child keys in the count, and counting one star twice gives a number that is one too big.
Sidekick.game(Sidekick.play({
  title: "Star Rows",
  emoji: "🌟",
  premise: "The stargazer drew the stars in rows. Count every star and key in how many.",
  outro: "Counting in rows helps you keep your place.",
  scene: "space",
  kind: "type",
  icon: "🔭",
  hint: "Count across one row, then keep counting on the next row.",
  tag: "counts_one_twice",
  rounds: [
    { say: "Count the stars. Key in how many.", pic: "⭐⭐⭐⭐⭐⭐ ⭐⭐⭐⭐⭐⭐", ans: 12, trap: 13, why: "That is one too many. Count each star only once.", win: "Twelve stars." },
    { say: "More stars tonight. Count them all.", pic: "⭐⭐⭐⭐⭐ ⭐⭐⭐⭐⭐ ⭐⭐⭐⭐⭐", ans: 15, trap: 16, why: "That is one too many. Finish one row before the next.", win: "Fifteen stars." },
    { say: "Count these stars by yourself.", alt: [{ pic: "⭐⭐⭐⭐⭐⭐⭐ ⭐⭐⭐⭐⭐⭐⭐", ans: 14, trap: 15 }, { pic: "⭐⭐⭐⭐⭐⭐ ⭐⭐⭐⭐⭐⭐ ⭐⭐⭐⭐⭐⭐", ans: 18, trap: 19 }, { pic: "⭐⭐⭐⭐⭐ ⭐⭐⭐⭐⭐ ⭐⭐⭐⭐⭐ ⭐⭐", ans: 17, trap: 18 }] },
  ],
}));
