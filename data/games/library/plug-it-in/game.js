// Plug It In. Skill 6.EE.A.2-3.
// Evaluating expressions at specific values of their variables, including formulas. Writing 3x with x = 4 as 34 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Plug It In",
  emoji: "🔌",
  premise: "A letter next to a number means multiply. To evaluate, swap the letter for its value and compute.",
  outro: "3x means 3 times x. When x = 4, 3x = 12, not 34.",
  scene: "desk",
  kind: "type",
  icon: "🔌",
  hint: "A number beside a letter means multiply them.",
  tag: "writes_digits_side_by_side",
  rounds: [
    { say: "Key in the value.", q: "Find 3x when x = 4.", ans: 12, trap: 34, why: "3x means 3 × x. It is not the digits 3 and 4 side by side.", win: "3 × 4 = 12." },
    { say: "Key in the value.", q: "Find 2n + 5 when n = 6.", ans: 17, trap: 31, why: "2n means 2 × 6 = 12. Then add 5.", win: "12 + 5 = 17." },
    { say: "Key in the value by yourself.", alt: [{ q: "Find 5y when y = 7.", ans: 35, trap: 57 }, { q: "Area is l × w. Find the area when l = 8 and w = 3.", ans: 24, trap: 11 }, { q: "Find 4a − 3 when a = 5.", ans: 17, trap: 42 }] },
  ],
}));
