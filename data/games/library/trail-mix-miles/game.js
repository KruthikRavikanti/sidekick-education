// Trail Mix Miles. Skill 4.NF.B.3-4.
// Word problems adding and subtracting fractions with like denominators that refer to the same whole. Adding the denominators is the known slip.
Sidekick.game(Sidekick.play({
  title: "Trail Mix Miles",
  emoji: "🥾",
  premise: "Story problems with fractions work like any other: join or take away pieces of the same whole.",
  outro: "In fraction stories, the pieces stay the same size. Add or subtract how many there are.",
  scene: "forest",
  kind: "type",
  icon: "🥾",
  hint: "Both fractions are parts of the same whole, cut the same way.",
  tag: "changes_the_whole",
  rounds: [
    { say: "Key in the answer as a fraction.", q: "Mia ran {3/8} mile and then {4/8} mile. How far in all?", ans: "7/8", trap: "7/16", why: "Both parts are eighths of the same mile. The pieces stay eighths.", win: "3 eighths and 4 eighths make 7 eighths of a mile." },
    { say: "Key in what is left.", q: "A jug had {9/10} liter. Sam poured out {4/10} liter. How much is left?", ans: "5/10", trap: "13/10", why: "Pouring out takes away. 9 tenths take away 4 tenths.", win: "5 tenths of a liter is left." },
    { say: "Solve it by yourself.", alt: [{ q: "Lee walked {2/6} mile to school and {3/6} mile to the park. How far in all?", ans: "5/6", trap: "5/12" }, { q: "A board is {7/8} foot long. Kai cuts off {2/8} foot. How long is it now?", ans: "5/8", trap: "9/8" }] },
  ],
}));
