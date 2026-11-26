// Sticker Stories. Skill 1.OA.A.1-1.
// Add-to and take-from stories with the result unknown. One story uses the word left as a pocket, so a keyword rule (left means subtract) gives the known slip.
Sidekick.game(Sidekick.play({
  title: "Sticker Stories",
  emoji: "📒",
  premise: "Every story hides a number. Read what really happens before you choose to add or take away.",
  outro: "The story tells you what to do, not a single clue word.",
  scene: "desk",
  kind: "type",
  icon: "📒",
  hint: "Picture the story. Are things joining or going away?",
  tag: "keyword_trick",
  rounds: [
    { say: "Read the story. Key in the answer.", q: "Mia has 9 stickers. She gets 6 more. How many stickers now?", ans: 15, trap: 3, why: "She got more stickers, so the number grows.", win: "9 and 6 more make 15." },
    { say: "Read carefully. What is really happening?", q: "Tom has 8 marbles in his left pocket and 5 in his right pocket. How many marbles in all?", ans: 13, trap: 3, why: "Left is a pocket here. Put both pockets together.", win: "Both pockets together hold 13." },
    { say: "Read the story and key in the answer.", alt: [{ q: "Ana had 14 grapes. She ate 6. How many grapes now?", ans: 8, trap: 20 }, { q: "Leo left 7 toys on the rug and 6 toys on the bed. How many toys in all?", ans: 13, trap: 1 }, { q: "Zoe had 12 shells. She gave away 5. How many shells now?", ans: 7, trap: 17 }] },
  ],
}));
