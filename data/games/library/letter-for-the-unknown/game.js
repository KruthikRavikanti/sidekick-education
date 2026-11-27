// Letter for the Unknown. Skill 3.OA.D.8-2.
// Writing one equation with a letter for a two-step story. An equation that shows only the first step is the known slip.
Sidekick.game(Sidekick.play({
  title: "Letter for the Unknown",
  emoji: "🔤",
  premise: "A whole two-step story can fit in one equation. Use the letter for the number you want to find.",
  outro: "One equation can hold both steps, with a letter for the unknown.",
  scene: "paper",
  kind: "row",
  hint: "Read the story again. Does your equation show everything that happens?",
  tag: "writes_only_one_step",
  rounds: [
    { say: "Build one equation for the whole story.", q: "4 packs of 6 pencils, then give away 5. Let p be how many are left.", seq: "4 × 6 − 5 = p", also: ["p = 4 × 6 − 5", "6 × 4 − 5 = p", "p = 6 × 4 − 5"], trap: "4 × 6 = p", why: "That shows only buying the pencils. Five were given away too.", win: "4 × 6 − 5 = p." },
    { say: "Build one equation for this story.", q: "3 bags of 5 apples, then 4 more apples. Let a be how many in all.", seq: "3 × 5 + 4 = a", also: ["a = 3 × 5 + 4", "5 × 3 + 4 = a", "a = 5 × 3 + 4"], trap: "3 × 5 = a", why: "That shows only the bags. There were 4 more apples too.", win: "3 × 5 + 4 = a." },
    { say: "Build this one by yourself.", alt: [{ q: "2 boxes of 9 pens, then 3 get lost. Let n be how many are left.", seq: "2 × 9 − 3 = n", also: ["n = 2 × 9 − 3", "9 × 2 − 3 = n", "n = 9 × 2 − 3"], trap: "2 × 9 = n" }, { q: "6 rows of 4 seats, then 2 more seats. Let s be how many seats.", seq: "6 × 4 + 2 = s", also: ["s = 6 × 4 + 2", "4 × 6 + 2 = s", "s = 4 × 6 + 2"], trap: "6 × 4 = s" }] },
  ],
}));
